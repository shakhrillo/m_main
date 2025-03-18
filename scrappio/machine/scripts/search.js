let hfpxzc = document.getElementsByClassName('hfpxzc')[0];

while (hfpxzc) {
  console.log(hfpxzc);

  const hfpxzcParent = hfpxzc.parentElement?.parentElement;
  
  if(hfpxzcParent) {
    hfpxzcParent.scrollIntoView({ behavior: 'smooth', block: 'center' });
  
    const hfpxzcParentNextElement = hfpxzcParent.nextElementSibling?.nextElementSibling;
    if (hfpxzcParentNextElement && hfpxzcParentNextElement.textContent.includes('reached the end of the list')) {
      console.log('Reached the end of the list.');
      break;
    }

    if(hfpxzcParentNextElement) {
      hfpxzc = hfpxzcParentNextElement.querySelector('a') || null;
    }
  }

  await new Promise(resolve => setTimeout(resolve, 400));
}
