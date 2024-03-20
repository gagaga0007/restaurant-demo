export const convertFileToBase64 = async (file: File): Promise<string> => {
	return new Promise((resolve) => {
		if (!file) return resolve('')

		const reader = new FileReader()
		reader.readAsDataURL(file as Blob)
		reader.onload = () => {
			return resolve(reader.result as string)
		}
	})
}