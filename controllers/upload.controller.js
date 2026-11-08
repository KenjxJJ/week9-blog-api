const handleFileUpload = (req, res, next) => {
    try {
        const files = req.filesList || [];

        if (files.length === 0) {
            return res.status(400).json({
                error: 'No files uploaded. Please upload up to 5 images using field name "images" or "image".'
            });
        }

        const protocol = req.protocol;
        const host = req.get('host');

        const uploadedData = files.map((file) => ({
            filename: file.filename,
            originalname: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
            url: `${protocol}://${host}/uploads/${file.filename}`,
            path: `/uploads/${file.filename}`
        }));

        return res.status(201).json({
            message: `${files.length} file(s) uploaded successfully`,
            count: files.length,
            data: uploadedData,
            urls: uploadedData.map(f => f.url)
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    handleFileUpload
};
