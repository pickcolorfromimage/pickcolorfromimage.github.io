  document.getElementById('image-input').addEventListener('change', handleImageUpload);
    
    let imageContainer = document.getElementById('image-container');
    let colorPicker = document.getElementById('color-picker');
    let colorInfo = document.getElementById('color-info');
    let colorValue = document.getElementById('color-value');
    let copyToClipboardBtn = document.getElementById('copy-to-clipboard');

    let selectedImage;

    function handleImageUpload(event) {
        const file = event.target.files[0];

        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();

            reader.onload = function (e) {
              selectedImage = new Image();
              selectedImage.src = e.target.result;

              selectedImage.onload = function () {
                imageContainer.innerHTML = '';
                imageContainer.appendChild(selectedImage);
                colorValue.innerHTML = `<p class="bg-yellow-400 text-center text-lg italic h-[68px] mt-1 pt-1">Mouse over image to select color<br/> <span class="font-bold">Click</span> to <span class="font-bold">copy color</span> to <span class="font-bold">clipboard</span></p>`;
                setupColorPicker();
              };
            };

            reader.readAsDataURL(file);
        }
    }

    function setupColorPicker() {

    imageContainer.addEventListener('click', copyColorToClipboard);

    colorPicker.style.display = 'block';

    imageContainer.addEventListener('mousemove', function (event) {
    const x = event.pageX - imageContainer.offsetLeft;
    const y = event.pageY - imageContainer.offsetTop;

    if (isMouseInsideImage(event)) {
        const pixel = getPixelColor(x, y);
        updateColorPickerPosition(x, y);
        colorValue.textContent = pixel;
        renderColorPreviewBlock(pixel);
    } 
    // else {
    //     // if mouse outside image bounds hide color block
    //     hideColorPreviewBlock();
    //     colorValue.textContent = "";
    // }
});

}

function isMouseInsideImage(event) {
    const x = event.pageX - imageContainer.offsetLeft;
    const y = event.pageY - imageContainer.offsetTop;
    
    return x >= 0 && x < selectedImage.width && y >= 0 && y < selectedImage.height;
}


// function hideColorPreviewBlock() {
//     const existingColorBlock = document.getElementById('color-block');
//     if (existingColorBlock) {
//         colorInfo.removeChild(existingColorBlock);
//     }
// }




  function renderColorPreviewBlock(color) {
      const colorBlock = document.createElement('div');
      colorBlock.style.width = '100%';
      colorBlock.style.height = '70px';
      colorBlock.style.marginRight = '10px';

      colorBlock.style.backgroundColor = color;
      
      // remove color block before adding new one
      const existingColorBlock = document.getElementById('color-block');
      if (existingColorBlock) {
          colorInfo.removeChild(existingColorBlock);
      }

      colorBlock.id = 'color-block';
      colorInfo.appendChild(colorBlock);
  }


  function getPixelColor(x, y) {
      const canvas = document.createElement('canvas');
      canvas.width = selectedImage.width;
      canvas.height = selectedImage.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(selectedImage, 0, 0, selectedImage.width, selectedImage.height);

      const pixel = ctx.getImageData(x, y, 1, 1).data;
      const hex = rgbToHex(pixel[0], pixel[1], pixel[2]);

      return hex;
  }

  function rgbToHex(r, g, b) {
      return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  function updateColorPickerPosition(x, y) {
      colorPicker.style.left = x - colorPicker.offsetWidth / 2 + 'px';
      colorPicker.style.top = y - colorPicker.offsetHeight / 2 + 'px';
  }

function copyColorToClipboard() {
    const imageColorCopiedMessage = document.getElementById('imageColorCopiedMessage');
    const choices = document.getElementById('choices');

    const textArea = document.createElement('textarea');
    const color = colorValue.textContent;

    textArea.value = color;
    document.body.appendChild(textArea);
    textArea.select();
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(color);
    } else{
      document.execCommand('copy'); // FOR IOS
    }

    document.body.removeChild(textArea);

    const colorBlock = createColorBlock(color);
    choices.appendChild(colorBlock);

    imageColorCopiedMessage.innerHTML = `<div class="color-code-copied-to-clipboard"><p class="bg-[${color}] p-2"><span class="bg-white text-black p-1">${color}</span></p><p class="p-2 mt-1 bg-black text-white">copied to clipboard</p></div>`;

    setTimeout(() => {
        imageColorCopiedMessage.innerHTML = '';
    }, 2000);
}

function createColorBlock(color) {
    const copiedMessage = document.getElementById('copiedMessage');
    const colorBlockContainer = document.getElementById('colorBlockContainer');

    const colorBlockGroup = document.createElement('div');
    colorBlockGroup.classList.add("flex", "items-center", "min-w-[135px]", "mr-2", "mb-2")

    const colorBlock = document.createElement('div');
    colorBlock.style.width = '50px';
    colorBlock.style.height = '50px';
    colorBlock.style.backgroundColor = color;
    // colorBlock.style.display = 'inline-block';
    colorBlock.style.marginRight = '10px';
    colorBlock.style.cursor = 'pointer';

    const hexCode = document.createElement('div');
    hexCode.textContent = color;

    colorBlock.addEventListener('click', function () {
      const textArea = document.createElement('textarea');
      textArea.value = color;
      document.body.appendChild(textArea);
      textArea.select();
      
      if (navigator.clipboard) {
        navigator.clipboard.writeText(color);
      } else{
        document.execCommand('copy'); // FOR IOS
      }
      
      document.body.removeChild(textArea);

      copiedMessage.innerHTML = `<div class="color-code-copied-to-clipboard"><p class="bg-[${color}] p-2"><span class="bg-white text-black p-1">${color}</span></p><p class="p-2 mt-1 bg-black text-white">copied to clipboard</p></div>`;
      setTimeout(() => {
          copiedMessage.innerHTML = '';
      }, 2000);
    });

    colorBlockGroup.appendChild(colorBlock);
    colorBlockGroup.appendChild(hexCode);

    colorBlockContainer.appendChild(colorBlockGroup);

    return colorBlockContainer;
}
