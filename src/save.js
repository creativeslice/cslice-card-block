/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-i18n/
 */
import {__} from '@wordpress/i18n';
import { isEmpty } from 'lodash';
/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-block-editor/#useBlockProps
 */
import {InnerBlocks, useBlockProps} from '@wordpress/block-editor';


/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/block-edit-save/#save
 *
 * @return {WPElement} Element to render.
 */
export default function Save(props) {
	const {
		attributes,
	} = props;
	const rel = isEmpty( attributes.link_rel ) ? undefined : attributes.link_rel;
	const target = isEmpty( attributes.link_target ) ? undefined : attributes.link_target;

	//const blockProps = useBlockProps.save();
	const HeaderTag = `h${attributes.header_level}`;
	const baseClass = 'wp-block-creativeslice-cslice-card-block-'
	const cardClasses = [
		attributes.className,
		'components-card',
		'components-card--elevation-' + attributes.card_elevation,
	]
	if (!attributes.card_borderless) {
		cardClasses.push('components-card--border')
	}
	if (attributes.card_rounded) {
		cardClasses.push('components-card--rounded')
	}
	const cardHeaderClasses = ['components-card__header',
		'components-card__header--level-' + attributes.header_level]
	const cardBodyClasses = ['components-card__body']
	let headerContents = attributes.header_text;
	if ( attributes.link_url ) {
		headerContents = (
			<a
				className='components-card__header__link'
				href={ attributes.link_url }
				target={ target }
				rel={ rel }
			>
				{ headerContents }
			</a>
		);
	}
	return (
		<div {...useBlockProps.save()} key="render" className={cardClasses.join(' ')}>
			<div className={cardHeaderClasses.join(' ')}>
				<HeaderTag>
					{headerContents}
				</HeaderTag>
			</div>
			<div className={cardBodyClasses.join(' ')}>
				<InnerBlocks.Content/>
			</div>
		</div>
	);
}
