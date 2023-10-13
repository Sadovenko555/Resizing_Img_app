function handleFileSelect() {
    const input = document.getElementById('imageInput');
    const files = input.files;
    const imageCountElement = document.getElementById('imageCount');

    imageCountElement.textContent = `Number of Images: ${files.length}`;
}

document.getElementById('imageInput').addEventListener('change', handleFileSelect);

function resizeImages() {
    const input = document.getElementById('imageInput');
    const files = input.files;

    if (files.length === 0) {
        alert('Choose at least one image.');
        return;
    }

    const maxDimension = 1500;
    const progressBar = document.getElementById('progressBar');
    const imageCountElement = document.getElementById('imageCount');
    const zip = new JSZip();
    let processedImages = 0;

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();

        reader.onload = function (event) {
            const image = new Image();
            image.src = event.target.result;

            image.onload = function () {
                let newWidth, newHeight;

                if (image.width > image.height) {
                    newWidth = image.width <= maxDimension ? image.width : maxDimension;
                    newHeight = (image.height / image.width) * newWidth;
                } else {
                    newHeight = image.height <= maxDimension ? image.height : maxDimension;
                    newWidth = (image.width / image.height) * newHeight;
                }

                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                canvas.width = maxDimension;
                canvas.height = maxDimension;

              
                if (file.type === 'image/png' && image.width <= maxDimension && image.height <= maxDimension) {
                  
                    ctx.clearRect(0, 0, maxDimension, maxDimension);
                } else {
                  
                    ctx.fillStyle = '#FFFFFF';
                    ctx.fillRect(0, 0, maxDimension, maxDimension);
                }

             
                const offsetX = (maxDimension - newWidth) / 2;
                const offsetY = (maxDimension - newHeight) / 2;
                ctx.drawImage(image, offsetX, offsetY, newWidth, newHeight);

                canvas.toBlob(function (blob) {
                    const fileName = file.name.replace(/\.[^/.]+$/, '');
                    const newFileName = fileName + '_resized.jpg';

                    zip.file(newFileName, blob);

                    processedImages++;

                    const progress = (processedImages / files.length) * 100;
                    progressBar.style.width = `${progress}%`;

                    if (processedImages === files.length) {
                        zip.generateAsync({ type: 'blob' }).then(function (content) {
                            saveAs(content, 'resized_images.zip');
                            progressBar.style.width = '0%';
                            imageCountElement.textContent = `Number of images: 0`;
                        });
                    }
                }, 'image/jpeg');
            };
        };

        reader.readAsDataURL(file);
    }
}



function handleFileSelect() {
    const input = document.getElementById('imageInput');
    const files = input.files;
    const imageCountElement = document.getElementById('imageCount');
    const imagePreviewsContainer = document.getElementById('imagePreviews');

    imageCountElement.textContent = `Number of Images: ${files.length}`;
    imagePreviewsContainer.innerHTML = '';

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();

        reader.onload = function (event) {
            const imagePreview = document.createElement('div');
            imagePreview.className = 'image-preview';
            const img = document.createElement('img');
            img.src = event.target.result;
            imagePreview.appendChild(img);
            imagePreviewsContainer.appendChild(imagePreview);
        };

        reader.readAsDataURL(file);
    }
}

document.getElementById('imageInput').addEventListener('change', handleFileSelect);
