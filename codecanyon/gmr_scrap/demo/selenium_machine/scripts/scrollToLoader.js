const targetParent = document.querySelector(".vyucnb")?.parentElement;

if (targetParent) {
  const lastChild = targetParent.lastElementChild;
  lastChild?.scrollIntoView();
}
