console.log("Script loaded");
console.log("Das ist der zweite Aufruf");
const userlist = document.getElementById('user-list');
const imageList = document.getElementById('image-list');
const albumList = document.getElementById('album-list')


// Define an array for users
let users = []; 
let images = []; // to be filled with images from api endpoint https://jsonplaceholder.typicode.com/photos
let albums = [];

// define async function to fetch users data
async function fetchUserData(){
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        // console.log(typeof(response);
        usersData = await response.json();
        // console.log(usersData);
        users = usersData;
        console.log(users);
        renderUsers();
        
    } catch (error) {
        console.log("Wir bekommen beim Aufruf der Users-APi den folgenden Fehler", error);
    }
}


// define async function to fetch image data
async function fetchImageData() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/photos');
        imageData = await response.json();
        images = imageData.slice(0, 10);
        // console.log(images);
        renderImages();
    } catch (error) {
        console.log("Wir bekommen beim Fetching der Image API folgenden Fehler: ", error)
    }
}

// define async to fetch albums
async function fetchAlbumData() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/albums');
        albumsData = await response.json();
        console.log(albumsData);
        albums = albumsData;
        renderAlbums();
    } catch (error) {
        console.log("Fehler:", error);
    }
}

function renderUsers(){
    users.forEach((user) => {
        const userItem = document.createElement('li');
        userItem.innerHTML = user.name;
        // console.log(user);

        userlist.appendChild(userItem);
    });
}

function renderImages(){
    images.forEach((image) => {
        const imageItem = document.createElement('img');
        console.log(imageItem);
        imageItem.setAttribute('src', image.url)
        imageList.appendChild(imageItem)

    });
}

function renderAlbums(){
    console.log(albums)
    albums.forEach((album) => {
        const albumItem = document.createElement('li');
        albumItem.innerHTML = album.title;
        console.log(albumItem)
        albumList.appendChild(albumItem);
    });
}

// define function for thumbnails and album images
async function loadAlbumsWithThumbnails() {
    try {
        const [albums, photos] = await Promise.all([
            fetch('https://jsonplaceholder.typicode.com/albums').then(res => res.json()),
            fetch('https://jsonplaceholder.typicode.com/photos').then(res => res.json())
        ]);

        const albumsContainer = document.getElementById('albums');

        albums.forEach(album => {
            const albumPhotos = photos.filter(photo => photo.albumId === album.id);
            const thumbnail = albumPhotos[0];

            const albumElement = document.createElement('div');
            albumElement.classList.add('album');
            albumElement.innerHTML = `
                <h2>${album.title}</h2>
                <img src="${thumbnail.thumbnailUrl}" alt="${thumbnail.title}" class="thumbnail">
                <div class="photos"></div>
            `;

            const photosContainer = albumElement.querySelector('.photos');
            const photosFragment = document.createDocumentFragment();
            albumPhotos.forEach((photo, index) => {
                setTimeout(() => {
                    const img = document.createElement('img');
                    img.src = photo.thumbnailUrl;
                    img.alt = photo.title;
                    photosFragment.appendChild(img);
                }, index * 50);
            });
            photosContainer.appendChild(photosFragment);

            const thumbnailElement = albumElement.querySelector('.thumbnail');
            thumbnailElement.addEventListener('click', () => {
                photosContainer.style.display = photosContainer.style.display === 'none' ? 'block' : 'none';
            });

            albumsContainer.appendChild(albumElement);
        });
    } catch (error) {
        console.error('Fehler:', error);
    }
}


fetchUserData();
fetchImageData();
fetchAlbumData();
loadAlbumsWithThumbnails();
// showUsers();
