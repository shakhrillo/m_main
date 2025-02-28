import { DocumentData, QuerySnapshot } from "firebase/firestore";

export const formatTotalEarnings = (snapshot: QuerySnapshot<DocumentData>) => {
  const groupedData = snapshot.docs.reduce<Record<string, any[]>>((acc, doc) => {
    const data = doc.data();
    const dateKey = data.createdAt.toDate().toISOString().split("T")[0];

    acc[dateKey] = acc[dateKey] || [];
    acc[dateKey].push({ id: doc.id, ...data });

    return acc;
  }, {});

  return Object.entries(groupedData)
    .map(([date, payments]) => ({
      id: `earnings_${date.replace(/-/g, "")}`,
      date,
      total: Number((payments.reduce((sum, { amount = 0 }) => sum + amount, 0)) / 100),
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};
