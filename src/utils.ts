export async function makeVAPIXCall(url: string, authorization: string, method: RequestInit["method"] = "GET", test: boolean = true ): Promise<Response | string> {
	if (test) {
		return url;
	}
	
	try {
		const response = await fetch(url, {
			method: method,
			headers: {
				"authorization": "Basic " + authorization,
			},
		});

		return response;

	// if (!response.ok) {
	// 	throw new Error(`HTTP error! status: ${response.status}`);
	// }

	// const text = await response.text();
	// console.log(text);
	} catch (error) {
		console.error("Request failed:", error);
		throw error;
	}
}

