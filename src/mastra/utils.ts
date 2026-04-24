export function getEndOfTheWeek(): Date {
	const today = new Date();
	const date = today.getDay();
	const untilEndOfTheWeek = 7 - date;

	const endOfWeekDate = new Date(
		today.setDate(today.getDate() + untilEndOfTheWeek),
	);

	return endOfWeekDate;
}
