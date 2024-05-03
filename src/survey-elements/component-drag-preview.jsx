import React from 'react';

const boxStyles = {
	border: '1px dashed gray',
	padding: '0.5rem 1rem',
	cursor: 'move',
};

const styles = {
	display: 'inline-block',
	transform: 'rotate(-7deg)',
	WebkitTransform: 'rotate(-7deg)',
};

const Box = ({ title, color }) => {
	const backgroundColor = color ? '#059862' : 'white';
	
	return (
		<div style={{ ...boxStyles, backgroundColor }}>{title}</div>
	);
};

export const BoxDragPreview = ({ item }) => {
	const [tickTock, setTickTock] = React.useState(false);

	const text = item.item.content ? item.item.content : (item.item.label ? item.item.label : item.item.text)
	const isLongText = text.length > 20;
	const previewText = isLongText ? `${text.slice(0, 20)}...` : text

	// React.useEffect(function subscribeToIntervalTick() {
	//     const interval = setInterval(() => {
	//         setTickTock(!tickTock);
	//     }, 500);
	//     return () => clearInterval(interval);
	// }, [tickTock]);

	return (
		<div style={styles} role="BoxPreview">
			<Box title={previewText} color={tickTock} />
		</div>
	);
};