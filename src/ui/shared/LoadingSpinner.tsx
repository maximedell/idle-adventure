function LoadingSpinner() {
	return (
		<div className="flex justify-center items-center py-12">
			<div className="w-8 h-8 border-4 border-primary-light border-t-transparent rounded-full animate-spin" />
		</div>
	);
}

export default LoadingSpinner;
