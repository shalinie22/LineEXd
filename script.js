// import fs from "fs"

function uploadImage() {
  const fileInput = document.getElementById("imageInput");
  const file = fileInput.files[0];

  if (!file) {
    alert("Please select an image first.");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);
//   displayImage(file)
  // Replace 'upload.php' or 'upload.js' with the URL to your server-side script
  fetch("https://b1cb-34-105-117-98.ngrok-free.app/runcode", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())

    .then((data) => {
      // Handle the response from the server (e.g., success or error message)
      displayImage(file)
      console.log(data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}


function fetchFiles() {
    fetch('https://b1cb-34-105-117-98.ngrok-free.app/download_files',{
        // mode:'no-cors'
        method: "POST",
        body: "Get the files",
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.blob(); // Extract the binary data from the response
    })
    .then((blob) => {
      // Create a new instance of JSZip
      const zip = new JSZip();

      zip.loadAsync(blob).then((zipFiles) => {
        const container = document.getElementById('imageContainer');
        container.innerHTML = ''; // Clear the container before displaying new images

        zip.forEach((relativePath, zipEntry) => {
          // Check if the file is an image (you may use more advanced checks if needed)
          if (isImageFile(zipEntry.name)) {
            zipEntry.async('blob').then((imageBlob) => {
              const para1 = document.createElement('p')
              const para = document.createElement('p')
              console.log(imageBlob)
              const img = document.createElement('img');
              img.src = URL.createObjectURL(imageBlob);
              const imageName = zipEntry.name.substring(zipEntry.name.lastIndexOf('/') + 1)
              if (imageName.includes("det")){
                para.textContent="Detection"
              }
              if (imageName.includes("kp")){
                para.textContent="KP Detection"
              }
              if (imageName.includes("mapped")){
                para.textContent="Mapped image"
              }
              
              img.alt = zipEntry.name;
              img.height = 300; // Replace with the desired height
              img.width = 500; //
              container.appendChild(para)
              container.appendChild(img);
              container.appendChild(para1)
            });
          }
          if (zipEntry.name.endsWith("json")){

            parseJSONFileAndCreateTable(zipEntry.name)
          }
        });
      });
    })
    .catch((error) => {
      console.error('Error fetching or extracting the zip file:', error);
    });
  
}


function parseJSONFileAndCreateTable(jsonfile) {
  fetch('https://b1cb-34-105-117-98.ngrok-free.app/json',{
    method: "POST",
    body: jsonfile
  }) // Replace 'data.json' with the actual path to your JSON file
    .then((response) => response.json())
    .then((data) => {
      data = data['KP']
      const tableContainer = document.getElementById('tableContainer');
      tableContainer.innerHTML = ''; // Clear any existing content in the container
      
      // Create a new table element
      const table = document.createElement('table');
      table.style.alignItems='left'
      // Create a header row for the table
      const headerRow = document.createElement('tr');
      const headerCellline = document.createElement('th');
      headerCellline.textContent = 'Line no.';
      const headerCellX = document.createElement('th');
      headerCellX.textContent = 'X';
      const headerCellY = document.createElement('th');
      headerCellY.textContent = 'Y';
      const para = document.createElement('p');
      para.textContent = 'TABLE';
      headerRow.appendChild(headerCellline);
      headerRow.appendChild(headerCellX);
      headerRow.appendChild(headerCellY);
      table.appendChild(para)
      table.appendChild(headerRow);
    
      // Iterate through the data and create rows for each coordinate pair
      var i=1
      for (const coordinates of Object.values(data)[0]) {
        
        for (const [x, y] of coordinates) {
          const dataRow = document.createElement('tr');
          const dataCellline = document.createElement('td');
          dataCellline.textContent = 'Line '+i.toString();
          const dataCellX = document.createElement('td');
          dataCellX.textContent = x;
          const dataCellY = document.createElement('td');
          dataCellY.textContent = y;
          dataRow.appendChild(dataCellline);
          dataRow.appendChild(dataCellX);
          dataRow.appendChild(dataCellY);
          table.appendChild(dataRow);
          
        }
        if (coordinates.length==0){
          const dataRow = document.createElement('tr');
          const dataCellline = document.createElement('td');
          dataCellline.textContent = 'Line '+i.toString();
          const dataCellX = document.createElement('td');
          dataCellX.textContent = "";
          const dataCellY = document.createElement('td');
          dataCellY.textContent = "";
          dataRow.appendChild(dataCellline);
          dataRow.appendChild(dataCellX);
          dataRow.appendChild(dataCellY);
          table.appendChild(dataRow);
        }
        i+=1
      }
    
      // Append the table to the container
      tableContainer.appendChild(table);
    })
    .catch((error) => {
      console.error('Error fetching or parsing JSON file:', error);
    });
}




function isImageFile(filename) {
  const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.bmp','.tif'];
  return imageExtensions.some((ext) => filename.toLowerCase().endsWith(ext));
}

function displayImage(file) {
    // const fileInput = data;
    const imagePreview = document.getElementById('imagePreview');

    // const file = fileInput.files[0];

    if (!file) {
        alert('Please select an image first.');
        return;
    }

    // Read the image file as a data URL
    const reader = new FileReader();
    reader.onload = function (e) {
        // Set the data URL as the source of the image element
        imagePreview.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function clearData(){
  const fileInput = document.getElementById("imageInput");
  const file = fileInput.files[0];
  if(file){
    location.reload();
  }
}