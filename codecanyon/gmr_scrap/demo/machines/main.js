const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, ".env.main"),
});
const { launchBrowser, openPage } = require("./services/browser");
const {
  waitTitle,
  openReviewTab,
  getInitialReviews,
  watchNewReviews,
  highLightElement,
  sortReviews,
  handleElementActions,
  elementReviewComment,
  elementReviewQA,
  getReviewDate,
  getReviewRate,
  getOwnerResponse,
  getImgURLs,
  getUserDetails,
  scrollToBottom,
} = require("./services/page");
const { Subject, concatMap, interval, take, map } = require("rxjs");
const { firestore } = require("./services/firebase");
const { uploadFile } = require("./services/storage");

async function scrap() {
  const tag = process.env.TAG;
  console.log("TAG", tag);
  const machine = await firestore.doc(`machines/${tag}`).get();

  if (!machine.exists) {
    console.error("Machine not found");
    await new Promise((resolve) => setTimeout(resolve, 4000));
    return;
  }

  console.log("Machine", machine.data());

  const { url, userId, reviewId, limit, sortBy } = machine.data();

  const newNodes$ = new Subject();
  const allElements = [];
  let lastRecordTime = new Date();
  // const url = process.env.URL;
  // const userId = process.env.USER_ID;
  // const reviewId = process.env.REVIEW_ID;
  // const limit = process.env.LIMIT;
  // const sortBy = process.env.SORT_BY;

  let browser;
  let page;
  let count = 0;
  let isFirstTime = true;

  const intervalRecordTime = setInterval(async () => {
    if (new Date() - lastRecordTime > 25000) {
      if (isFirstTime) {
        isFirstTime = false;
        await scrollToBottom(page);
        lastRecordTime = new Date();
      } else {
        clearInterval(intervalRecordTime);
        count = limit;
        newNodes$.next("end");
      }
    }
  }, 1000);

  const uploadReviewsAsFile = async () => {
    if (!allElements?.length) return { csvUrl: "", jsonUrl: "" };

    const jsonContent = JSON.stringify(allElements, null, 2);
    const csvContent = [
      Object.keys(allElements[0]).join(","),
      ...allElements.map((el) => Object.values(el).join(",")),
    ].join("\n");

    const [csvUrl, jsonUrl] = await Promise.all([
      uploadFile(csvContent, `csv/${reviewId}.csv`),
      uploadFile(jsonContent, `json/${reviewId}.json`),
    ]);

    return { csvUrl, jsonUrl };
  };

  async function addReviews() {
    if (!allElements.length) return;

    const collectionRef = firestore.collection(
      `users/${userId}/reviews/${reviewId}/reviews`
    );
    const chunkSize = 500;

    await Promise.all(
      allElements.reduce((batches, _, i) => {
        if (i % chunkSize === 0) {
          const chunk = allElements.slice(i, i + chunkSize);
          const batch = firestore.batch();

          chunk.forEach((doc) => {
            if (doc?.id) batch.set(collectionRef.doc(doc.id), doc);
          });

          batches.push(batch.commit());
        }
        return batches;
      }, [])
    );
  }

  async function reviewUpdate(data = {}) {
    console.log(`Updated - ${JSON.stringify(data)}`);
    return await firestore.doc(`users/${userId}/reviews/${reviewId}`).update({
      updatedAt: new Date(),
      ...data,
    });
  }

  const subscription = newNodes$
    .pipe(
      concatMap((record) =>
        interval(2000).pipe(
          take(1),
          map(() => record)
        )
      )
    )
    .subscribe(async (record) => {
      lastRecordTime = new Date();
      isFirstTime = true;
      if (limit && count >= limit) {
        await complete();
      } else {
        await highLightElement(page, record);
        await handleElementActions(page, record);

        const user = await getUserDetails(page, record);
        const timeComment = await getReviewDate(page, record);
        const rateComment = await getReviewRate(page, record);
        const reviewComment = await elementReviewComment(page, record);
        const reviewQA = await elementReviewQA(page, record);
        const ownerResponse = await getOwnerResponse(page, record);
        const imgURLs = await getImgURLs(page, record);

        allElements.push({
          id: record,
          review: reviewComment,
          date: timeComment,
          response: ownerResponse,
          responseTime: "",
          imageUrls: imgURLs,
          rating: rateComment,
          qa: reviewQA,
          user: user,
        });
      }

      if (count % 10 === 0) {
        await reviewUpdate({ totalReviews: count });
      }

      count++;
    });

  async function complete() {
    const { csvUrl, jsonUrl } = await uploadReviewsAsFile(
      allElements,
      reviewId
    );
    await addReviews();
    await reviewUpdate({
      completedAt: new Date(),
      status: "completed",
      csvUrl,
      jsonUrl,
      totalReviews: allElements.length,
    });
    console.log("DONE!");
  }

  async function init() {
    try {
      browser = await launchBrowser();

      page = await openPage(browser, url);
      page.exposeFunction("newNodes", function (record) {
        newNodes$.next(record);
      });

      const title = await waitTitle(page);
      await reviewUpdate({ title });

      await new Promise((resolve) => setTimeout(resolve, 2000));
      await openReviewTab(page);

      await new Promise((resolve) => setTimeout(resolve, 2000));
      await sortReviews(page, sortBy);

      const initialReviews = await getInitialReviews(page);
      initialReviews.forEach((review) => newNodes$.next(review));

      watchNewReviews(page);
    } catch (error) {
      console.log("Error: ->", error);
      complete();
    }
  }

  init();
}

scrap();
