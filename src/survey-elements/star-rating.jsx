import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import cx from 'classnames';

/**
 * @fileoverview react-star-rating
 * @author @cameronjroe
 * <StarRating
 *   name={string} - name for form input (required)
 *   caption={string} - caption for rating (optional)
 *   ratingAmount={number} - the rating amount (required, default: 5)
 *   rating={number} - a set rating between the rating amount (optional)
 *   disabled={boolean} - whether to disable the rating from being selected (optional)
 *   editing={boolean} - whether the rating is explicitly in editing mode (optional)
 *   size={string} - size of stars (optional)
 *   onRatingClick={function} - a handler function that gets called onClick of the rating (optional)
 *   />
 */

const StarRating = ({ name, caption, rating: ratingVal, editing: editingVal, disabled, size, onRatingClick, min = 0, max = 5, step = 0.5, ratingAmount, ...otherProps }) => {
	const rootRef = React.useRef();
	const rootContainerRef = React.useRef();

	max = ratingAmount || 5;

	/**
	 * Gets the stars based on ratingAmount
	 * @return {string} stars
	 */
	const getStars = () => {
		let stars = '';
		const numRating = ratingAmount;
		for (let i = 0; i < numRating; i++) {
			stars += '\u2605';
		}

		return stars;
	};

	const getPosition = (e) => {
		return e.pageX - (rootRef?.current?.getBoundingClientRect()?.left ?? 0);
	}

	const applyPrecision = (val, precision) => {
		return parseFloat(val.toFixed(precision));
	};

	const getDecimalPlaces = (num) => {
		const match = (`${num}`).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);

		return !match ? 0 : Math.max(0, (match[1] ? match[1].length : 0) - (match[2] ? +match[2] : 0));
	};

	const getWidthFromValue = (val) => {
		if (val <= min || min === max) {
			return 0;
		}

		if (val >= max) {
			return 100;
		}

		return (val / (max - min)) * 100;
	};

	const getValueFromPosition = (pos) => {
		const precision = getDecimalPlaces(step);
		const maxWidth = (rootContainerRef?.current?.offsetWidth ?? 30);
		const diff = max - min;
		let factor = (diff * pos) / (maxWidth * step);
		factor = Math.ceil(factor);
		let val = applyPrecision(parseFloat(min + factor * step), precision);
		val = Math.max(Math.min(val, max), min);

		return val;
	};

	const calculate = (pos) => {
		const val = getValueFromPosition(pos);
		let width = getWidthFromValue(val);

		width += '%';
		return { width, val };
	};

	const getStarRatingPosition = (val) => {
		return `${getWidthFromValue(val)}%`;
	};

	const getRatingEvent = (e) => {
		const pos = getPosition(e);

		return calculate(pos);
	};

	const getSvg = () => {
		return (
			<svg className="react-star-rating__star" viewBox="0 0 286 272" version="1.1" xmlns="http://www.w3.org/2000/svg">
				<g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
					<polygon id="star-flat" points="143 225 54.8322122 271.352549 71.6707613 173.176275 0.341522556 103.647451 98.9161061 89.3237254 143 0 187.083894 89.3237254 285.658477 103.647451 214.329239 173.176275 231.167788 271.352549 "></polygon>
				</g>
			</svg>
		);
	};

	const handleMouseLeave = () => {
		setPos(ratingCache.pos);
		setRating(!isNaN(ratingCache.rating) ? Number(ratingCache.rating) : 0);
	};

	const handleMouseMove = (e) => {
		// get hover position
		const ratingEvent = getRatingEvent(e);

		updateRating(
			ratingEvent.width,
			ratingEvent.val,
		);
	};

	const updateRating = (width, val) => {
		setPos(width);
		setRating(!isNaN(val) ? Number(val) : 0);
	};

	// React.memo(StarRating,)

	// const shouldComponentUpdate = (nextProps, nextState) => {
	// 	if (nextProps !== props) {
	// 		updateRating(getStarRatingPosition(nextProps.rating), nextProps.rating,);
	// 		return true;
	// 	}
	// 	return nextState.ratingCache.rating !== this.state.ratingCache.rating || nextState.rating !== this.state.rating;
	// }

	const handleClick = (e) => {
		// is it disabled?
		if (disabled) {
			e.stopPropagation();
			e.preventDefault();
			return false;
		}

		const ratingCacheObj = {
			pos: pos,
			rating: rating,
			caption: caption,
			name: name
		};

		setRatingCache(ratingCacheObj);

		if (onRatingClick) {
			onRatingClick(e, ratingCache);
		}

		return true;
	}

	const treatName = (title) => {
		if (typeof title === 'string') {
			return title.toLowerCase().split(' ').join('_');
		}

		return null;
	};

	const [ratingCache, setRatingCache] = React.useState({
		pos: ratingVal ? getStarRatingPosition(ratingVal) : 0,
		rating: !isNaN(ratingVal) ? parseFloat(ratingVal, 10) : 0,
	});
	const [editing, setEditing] = React.useState(editingVal || !ratingVal);
	const [stars, setStars] = React.useState(5);
	const [rating, setRating] = React.useState(!isNaN(ratingCache.rating) ? parseFloat(ratingCache.rating, 10) : 0);
	const [pos, setPos] = React.useState(ratingCache.pos);
	const [glyph, setGlyph] = React.useState(getStars());

	// let caption = null;
	const classes = cx({
		'react-star-rating__root': true,
		'rating-disabled': disabled,
		[`react-star-rating__size--${size}`]: size,
		'rating-editing': editing,
	});

	// is there a caption?
	// if (caption) {
	//   caption = (<span className="react-rating-caption">{caption}</span>);
	// }


	// are we editing this rating?
	let starRating;
	if (editing) {
		starRating = (
			<div ref={rootContainerRef}
				className="rating-container rating-gly-star"
				data-content={glyph}
				onMouseMove={handleMouseMove}
				onMouseLeave={handleMouseLeave}
				onClick={handleClick}>
				<div className="rating-stars" data-content={glyph} style={{ width: pos }}></div>
			</div>
		);
	} else {
		starRating = (
			<div ref={rootContainerRef} className="rating-container rating-gly-star" data-content={glyph}>
				<div className="rating-stars" data-content={glyph} style={{ width: pos }}></div>
			</div>
		);
	}

	return (
		<span className="react-star-rating">
			<span ref={rootRef} style={{ cursor: 'pointer' }} className={classes}>
				{starRating}
				<input type="hidden" name={name} value={ratingCache.rating} style={{ display: 'none !important', width: 65 }} min={min} max={max} readOnly />
			</span>
		</span>
	);
};

StarRating.propTypes = {
	name: PropTypes.string.isRequired,
	caption: PropTypes.string,
	ratingAmount: PropTypes.number.isRequired,
	rating: PropTypes.number,
	onRatingClick: PropTypes.func,
	disabled: PropTypes.bool,
	editing: PropTypes.bool,
	size: PropTypes.string,
};

StarRating.defaultProps = {
	step: 0.5,
	ratingAmount: 5,
	onRatingClick() { },
	disabled: false,
};

export default StarRating;