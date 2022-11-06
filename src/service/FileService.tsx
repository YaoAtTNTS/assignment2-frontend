interface UploadFileResponse {
    success: boolean,
    message: string
}

class FileService
{
    private file: File

    constructor(file: File) {
        this.file = file
    }

    static getFileExtension(fileName: string): string {
        const fileNames: Array<string> = fileName.split('.')

        if (fileNames.length === 0) {
            return ''
        }

        return fileNames[fileNames.length - 1]
    }

    async getProgress(): Promise<number> {
        const progressCount = await fetch('http://localhost:8080/invoice/upload/progress', {
            method: 'GET',
            headers: [
                ['withCredentials', 'false']
            ],
        }).then(res => res.json());
        return progressCount;
    }

    async uploadFile(): Promise<UploadFileResponse> {
        const uploadResponse = await fetch('http://localhost:8080/invoice/upload', {
            method: 'POST',
            headers: [
                ['contentType', 'text/csv'],
                ['withCredentials','false']
            ],
            body: this.getFormData()
        })

        const responseJson = await uploadResponse.json()

        // eslint-disable-next-line eqeqeq
        if (uploadResponse.status != 200) {
            return {
                success: false,
                message: responseJson.result
            }
        }

        return {
            success: true,
            message: responseJson.result
        }
    }

    private getFormData(): FormData {
        const formData = new FormData()
        formData.append('file', this.file)
        return formData
    }
}

export default FileService