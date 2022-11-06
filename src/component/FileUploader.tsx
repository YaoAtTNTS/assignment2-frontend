import {SyntheticEvent, useState} from 'react'

import {
    Box,
    Flex,
    Input,
    createStandaloneToast
} from '@chakra-ui/react'

import FileService from '../service/FileService'
import ProgressModal from "./ProgressModal";

function FileUploader() {
    const [isProgressModalOpen, setIsProgressModalOpen] = useState<boolean>(false)

    const handleFileUpload = async (element: HTMLInputElement) => {
        const file = element.files

        if (!file) {
            return
        }

        const toast = createStandaloneToast()

        if (FileService.getFileExtension(file[0].name) !== 'csv') {
            toast({
                title: 'Invalid File Type',
                description: 'The accepted file types include .csv only.',
                status: 'error',
                position: "top",
                duration: null,
                isClosable: true,
                onCloseComplete: () => {
                    element.value = ''
                }
            });
            return
        }

        setIsProgressModalOpen(true);
        const fileService = new FileService(file[0])
        const fileUploadResponse = await fileService.uploadFile()

        setIsProgressModalOpen(false);

        element.value = ''

        toast({
            title: fileUploadResponse.success ? 'File Uploaded' : 'Upload Failed',
            description: fileUploadResponse.message,
            status: fileUploadResponse.success ? 'success' : 'error',
            position: "top",
            duration: null,
            isClosable: true,
            onCloseComplete: () => {}
        })
    }

    return (
        <Box shadow="base">
            <Flex direction="column" alignItems="center" mb="5">
                <Box mt="0" ml="24">
                    <Input
                        type="file"
                        variant="unstyled"
                        onChange={(e: SyntheticEvent) => handleFileUpload(e.currentTarget as HTMLInputElement)}
                    />
                </Box>
            </Flex>
            <ProgressModal
                isOpen={isProgressModalOpen}
                onClose={() => setIsProgressModalOpen(false)}
            />
        </Box>
    )
}

export default FileUploader;