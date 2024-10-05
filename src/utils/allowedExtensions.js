/**
 * Object defining allowed file extensions for different file types.
 * 
 * @constant
 * @type {Object}
 * @property {Array<String} image - Allowed image file extensions (e.g. , ['jpg', 'jpeg', 'png', 'gif']).
 * @property {Array<String} video - Allowed video file extensions (e.g. , ['mp4', 'avi', 'mkv']).
 * @property {Array<String} audio - Allowed audio file extensions (e.g. , ['mp3', 'wav']).
 * @property {Array<String} document - Allowed document file extensions (e.g. , ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt']).
 * @property {Array<String} code - Allowed code file extensions (e.g. , ['js', 'jsx', 'ts', 'tsx', 'html', 'css', 'scss', 'json', 'xml']).
 * @property {Array<String} compressed - Allowed compressed file extensions (e.g. , ['zip', 'rar', '7z']).
 */
export const allowedExtensions = {
    image: ['jpg', 'jpeg', 'png', 'gif'],
    video: ['mp4', 'avi', 'mkv'],
    audio: ['mp3', 'wav'],
    document: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt'],
    resume_pdf: ['pdf'],
    code: ['js', 'jsx', 'ts', 'tsx', 'html', 'css', 'scss', 'json', 'xml'],
    compressed: ['zip', 'rar', '7z']
}