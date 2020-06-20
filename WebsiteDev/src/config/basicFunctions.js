// This file will contain frequently called functions throughout the app. They will be exported as named exports

// This function will take in a date object and will convert it to a string in a YYYY-MM-DD format
const convertDateToString = (dateObject) => {
	let year = dateObject.getFullYear();
	let month = dateObject.getMonth() + 1;
	let day = dateObject.getDate();
	if (month < 10) {
		month = '0' + month;
	}
	if (day < 10) {
		day = '0' + day;
	}
	const dateString = year + '-' + month + '-' + day;

	return dateString;
};

export { convertDateToString };
