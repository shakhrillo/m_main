let hfpxzc = document.getElementsByClassName('hfpxzc')[0];

while (hfpxzc) {
  console.log(hfpxzc);

  const hfpxzcParent = hfpxzc.parentElement?.parentElement;

  if (hfpxzcParent) {
    hfpxzcParent.scrollIntoView({ behavior: 'smooth', block: 'center' });

    const hfpxzcParentNextElement = hfpxzcParent.nextElementSibling?.nextElementSibling;
    if (hfpxzcParentNextElement && hfpxzcParentNextElement.textContent.includes('reached the end of the list')) {
      console.log('Reached the end of the list.');
      break;
    }

    if (hfpxzcParentNextElement) {
      hfpxzc = hfpxzcParentNextElement.querySelector('a') || null;
    } else {
      hfpxzc = null; // Prevent infinite loop if no next element exists
    }
  } else {
    hfpxzc = null; // Prevent infinite loop if parent element is null
  }

  await new Promise(resolve => setTimeout(resolve, 400));
}
