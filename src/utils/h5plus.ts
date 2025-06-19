export const readFileAsArrayBuffer = (filePath:string) => {
	return new Promise((resolve, reject) => {
		console.log('filePath:', filePath);
		plus.io.resolveLocalFileSystemURL(filePath, (entry) => {
				console.log('entry:', entry);
				console.log('entry.file:', entry.file);
				entry.file((file) => {
					console.log('file:', file, JSON.stringify(file));
					const fileReader = new plus.io.FileReader();
					fileReader.onloadend = (e) => {
						// console.log('onloadend :', JSON.stringify(e));
						const base64 = e?.target?.result
						if (base64) {
							resolve(base64)
						} else {
							reject({ message: '文件为null' })
						}
					};
					fileReader.onerror = (e) => {
						console.error('onerror:', JSON.stringify(e));
						reject(e)
					};
					fileReader.readAsDataURL(file);
					// console.log('fileReader.readAsArrayBuffer:', fileReader.readAsArrayBuffer);
				}, (err) => {
					console.error('entry err', JSON.stringify(err))
					reject(err)
				});
			},
			(err) => {
				console.error('resolveLocalFileSystemURL err', JSON.stringify(err))
				reject(err)
			}
		);
	});
}

export const setStatusBarStyle = (style) => {
	; //'light' || 'dark'


	onPlusReady(() => {
		console.log('setStatusBarStyle', style);
		plus.navigator.setStatusBarStyle(style)
	})
}

export const onPlusReady = (fn) => {
	document.addEventListener('UniAppJSBridgeReady', fn);
}
