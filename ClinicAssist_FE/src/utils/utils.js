export const dateFormatter = (dateString) => {
	return new Date(dateString).toLocaleDateString("en-US", {
	  weekday: "long",
	  month: "short",
	  day: "numeric",
	})
}