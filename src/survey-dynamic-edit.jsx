import React from 'react';

const SurveyElementsEditor = (props) => {
	const [
		dynamic,
		setDynamic,
	] = React.useState(null);

	React.useEffect(() => {
		const loadDynamic = async () => {
			const x = await import('./survey-elements-edit');
			setDynamic(() => x.default);
		};
		loadDynamic();
	}, []);

	if (!dynamic) {
		return (<div>Loading...</div>);
	}
	const Component = dynamic;
	return <Component {...props} />;
};

export default SurveyElementsEditor;