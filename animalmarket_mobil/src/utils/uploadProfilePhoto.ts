import { launchImageLibrary, ImagePickerResponse, MediaType } from 'react-native-image-picker';
import { AppConfig } from '@config/animalmarket-config';
// import { ApiService } from '@services/ApiService'; // TODO: Fix ApiService import
import { FileProviderAPI } from '@api/base_modules/FileProvider';

export const pickAndUploadProfilePhoto = async ({
    userId,
    tenantId,
    bucketId,
}: {
    userId: string;
    tenantId: string;
    bucketId: string;
}): Promise<FileProviderAPI.Files.Upload.IResponseModel | null> => {
    try {
        return new Promise((resolve) => {
            launchImageLibrary(
                {
                    mediaType: 'photo' as MediaType,
                    quality: 0.7, // Image compression (0.0 to 1.0)
                    maxWidth: 800,
                    maxHeight: 800,
                },
                (response: ImagePickerResponse) => {
                    if (response.didCancel || response.errorMessage || !response.assets || response.assets.length === 0) {
                        resolve(null);
                        return;
                    }

                    const file = response.assets[0];

                    // Continue with the upload logic
                    uploadImage(file, userId, tenantId, bucketId).then(resolve).catch(() => resolve(null));
                }
            );
        });
    } catch (error) {
        console.error('Image picker error:', error);
        return null;
    }
};

const uploadImage = async (
    file: any,
    userId: string,
    tenantId: string,
    bucketId: string
): Promise<FileProviderAPI.Files.Upload.IResponseModel | null> => {
    try {
        // Create form data for upload - no need for image manipulation as react-native-image-picker handles compression
        const formData = new FormData();
        formData.append('folderName', 'ProfilePictures');
        formData.append('entityId', userId);
        formData.append('moduleName', 'hirovo');
        formData.append('versionName', 'v1');
        formData.append('tenantId', tenantId);
        formData.append('bucketType', FileProviderAPI.Enums.BucketTypes.SingleFileBucket.toString());
        formData.append('bucketId', bucketId);
        formData.append('formFile', {
            uri: file.uri,
            name: file.fileName || `profile_${Date.now()}.jpg`,
            type: file.type || 'image/jpeg',
        } as any);

        // TODO: Fix ApiService integration
        throw new Error('Photo upload disabled - ApiService integration pending');
        /*
        return await ApiService.callMultipart<FileProviderAPI.Files.Upload.IResponseModel>(
            FileProviderAPI.Files.Upload.RequestPath,
            formData
        );
        */
    } catch (err: any) {
        console.error('📁 Profil resmi yükleme hatası:', {
            status: err?.response?.status,
            data: err?.response?.data,
            url: err?.config?.url,
            headers: err?.config?.headers,
        });
        return null;
    }
};
