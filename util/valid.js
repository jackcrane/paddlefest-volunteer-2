export const LONGER_THAN_N = (n) => (value) => value?.length > n;
export const MATCHES_EMAIL = (value) => {
	const re = /\S+@\S+\.\S+/;
	return re.test(value || '');
};
export const MATCHES_PHONE = (value) => {
	const re = /^\d{10}$/;
	return re.test(value || '');
};
export const IS_NUMBER = (value) => {
	try {
		const f = parseFloat(value);
		return !isNaN(f);
	} catch (error) {
		return false;
	}
};
