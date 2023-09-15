function resizeImages() {
    const input = document.getElementById('imageInput');
    const files = input.files;

    if (files.length === 0) {
        alert('Выберите хотя бы одно изображение.');
        return;
    }

    const maxDimension = 1500; 

    if (files.length === 1) {
       
        const file = files[0];
        const reader = new FileReader();

        reader.onload = function(event) {
            const image = new Image();
            image.src = event.target.result;

            image.onload = function() {
                let newWidth, newHeight;

                if (image.width > image.height) {
                    newWidth = maxDimension;
                    newHeight = (image.height / image.width) * maxDimension;
                } else {
                    newHeight = maxDimension;
                    newWidth = (image.width / image.height) * maxDimension;
                }

                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                canvas.width = newWidth;
                canvas.height = newHeight;

                if (file.type === 'image/png' || file.type === 'image/webp') {
                   
                    ctx.fillStyle = '#FFFFFF';
                    ctx.fillRect(0, 0, newWidth, newHeight);
                }

                ctx.drawImage(image, 0, 0, newWidth, newHeight);

                canvas.toBlob(function(blob) {
                    const fileName = file.name.replace(/\.[^/.]+$/, ""); 
                    const newFileName = fileName + '_resized.jpg'; 

                    
                    saveAs(blob, newFileName);
                }, 'image/jpeg');
            };
        };

        reader.readAsDataURL(file);
    } else {
       
        const zip = new JSZip();

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const reader = new FileReader();

            reader.onload = function(event) {
                const image = new Image();
                image.src = event.target.result;

                image.onload = function() {
                    let newWidth, newHeight;

                    if (image.width > image.height) {
                        newWidth = maxDimension;
                        newHeight = (image.height / image.width) * maxDimension;
                    } else {
                        newHeight = maxDimension;
                        newWidth = (image.width / image.height) * maxDimension;
                    }

                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    canvas.width = newWidth;
                    canvas.height = newHeight;

                    if (file.type === 'image/png' || file.type === 'image/webp') {
                        
                        ctx.fillStyle = '#FFFFFF';
                        ctx.fillRect(0, 0, newWidth, newHeight);
                    }

                   
                    ctx.drawImage(image, 0, 0, newWidth, newHeight);

                    canvas.toBlob(function(blob) {
                        const fileName = file.name.replace(/\.[^/.]+$/, ""); 
                        const newFileName = fileName + '_resized.jpg'; 

                        
                        zip.file(newFileName, blob);

                        
                        if (i === files.length - 1) {
                            zip.generateAsync({ type: "blob" }).then(function(content) {
                                saveAs(content, "resized_images.zip");
                            });
                        }
                    }, 'image/jpeg'); 
                };
            };

            reader.readAsDataURL(file);
        }
    }
}