import {deleteObject, getDownloadURL, ref, uploadBytes} from 'firebase/storage'
import {firebaseStorage} from '@/firebase'

export const uploadFile = async (filename, file, folderName) => {
    let fileUrl = '';
    const storageRef = ref(firebaseStorage, folderName);
    const fileRef = ref(storageRef, filename)
    await uploadBytes(fileRef, file).then(() => {
        return true
    });
    await getDownloadURL(fileRef)
        .then((url) => {
            fileUrl = url
        })
    return fileUrl
}

export const getFileName = (url) => {
    const filename = url.split('%2F')[2].split('?')[0].split('%20').join(' ')
    return filename
}

export const deleteFile = async (filename, folderName) => {
    const storageRef = ref(firebaseStorage, folderName);
    const fileRef = ref(storageRef, filename)
    const snapshot = await deleteObject(fileRef)
    return snapshot
}