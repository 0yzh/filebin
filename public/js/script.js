const selectFile = document.querySelector('#chooseFile');
const noFile = document.querySelector('#noFile');
const submit = document.querySelector('#submit');
const remove = document.querySelector('#remove');

selectFile.addEventListener('change', () => {
  const fileName = selectFile.value;
  const upload = document.querySelector('.file-upload');
  if (!fileName) {
    upload.classList.remove('active');
    noFile.innerHTML = 'No file chosen...';
  } else {
    upload.classList.add('active');
    noFile.innerHTML = fileName.replace('C:\\fakepath\\', '');
    submit.style.background = '#3fa46a';
  }
  console.log(fileName);
});
