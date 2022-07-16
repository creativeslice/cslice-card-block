/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-i18n/
 */
import {__} from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-block-editor/#useBlockProps
 */
import {
	useBlockProps,
	RichText,
	InspectorControls,
	PanelColorSettings,
	MediaUpload,
	MediaUploadCheck,
	BlockControls,
	InnerBlocks,
	__experimentalLinkControl as LinkControl, // eslint-disable-line
} from '@wordpress/block-editor';
import {
	CheckboxControl,
	Panel,
	PanelBody,
	PanelRow,
	ColorPalette,
	ToggleControl,
	SelectControl,
	TextControl,
	Placeholder,
	Popover,
	Button,
	Spinner,
	ToolbarButton,
	ToolbarGroup,
} from '@wordpress/components';
import {
	link,
} from '@wordpress/icons';
import {useState, useEffect, useRef } from '@wordpress/element';
import { displayShortcut, isKeyboardEvent } from '@wordpress/keycodes';
import {
	Card,
	CardHeader,
	CardBody,
	CardFooter,
	__experimentalText as Text,
	__experimentalHeading as Heading,
	__experimentalNumberControl as NumberControl,

} from '@wordpress/components';

const NEW_TAB_REL = 'noreferrer noopener';
/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/block-edit-save/#edit
 *
 * @return {WPElement} Element to render.
 */
export default function Edit(props) {
	const {attributes, className, isSelected, setAttributes} = props;
	const blockProps = useBlockProps();

	/**
	 * documentation for these values https://developer.wordpress.org/block-editor/reference-guides/core-blocks/
	 * @type {string[]}
	 */
	const ALLOWED_BLOCKS = ['core/paragraph',
		'core/image',
		'core/html',
		'core/freeform',];
	const cardSizes = [
		{
			label: 'X Small',
			value: 'xSmall',
		},
		{
			label: 'Small',
			value: 'small',
		},
		{
			label: 'Medium',
			value: 'medium',
		},
		{
			label: 'Large',
			value: 'large',
		},
	];
	const {
		link_url,
		link_target,
		linkUrl
	} = attributes;
	const ref = useRef();
	const [ isEditingURL, setIsEditingURL ] = useState( false );
	const isURLSet = !! linkUrl;
	const opensInNewTab = link_target === '_blank';
	function startEditing( event ) {
		event.preventDefault();
		setIsEditingURL( true );
	}

	function unlink() {
		setAttributes( {
			linkUrl: undefined,
			link_target: undefined,
			link_url: undefined,
		} );
		setIsEditingURL( false );
	}

	function onToggleOpenInNewTab( value ) {
		const newlink_target = value ? '_blank' : undefined;

		let updatedRel = link_url;
		if ( newlink_target && ! link_url ) {
			updatedRel = NEW_TAB_REL;
		} else if ( ! newlink_target && link_url === NEW_TAB_REL ) {
			updatedRel = undefined;
		}

		setAttributes( {
			link_target: newlink_target,
			link_url: updatedRel,
		} );
	}

	function onKeyDown( event ) {
		if ( isKeyboardEvent.primary( event, 'k' ) ) {
			startEditing( event );
		} else if ( isKeyboardEvent.primaryShift( event, 'k' ) ) {
			unlink();
			iconRef.current?.focus();
		}
	}

	// Sidebar: Select city
	const onChangeCardSize = (value) => {
		props.setAttributes({
			card_size: value,
		});
	};
	// Sidebar: Select city
	const onChangeCardHeaderSize = (value) => {
		props.setAttributes({
			card_header_size: value,
		});
	};

	// Sidebar: Select city
	const onChangeHeaderText = (value) => {
		props.setAttributes({
			header_text: value,
		});
	};
	// Sidebar: Select city
	const onChangeHeaderLevel = (value) => {
		props.setAttributes({
			header_level: value,
		});
	};

	const onChangeBorderless = (value) => {
		props.setAttributes({
			//showArrow: !attributes.showArrow
			card_borderless: value,
		});
	};

	const onChangeRounded = (value) => {
		props.setAttributes({
			//showArrow: !attributes.showArrow
			card_rounded: value,
		});
	};
	const onChangeElevation = (value) => {
		props.setAttributes({
			card_elevation: value,
		});
	};

	return [
		<BlockControls>
			<ToolbarGroup>
				<ToolbarButton
					name="link"
					icon={ link }
					title={ __( 'Link', 'cslice-icon-block' ) }
					shortcut={ displayShortcut.primary( 'k' ) }
					onClick={ startEditing }
					isActive={ isURLSet }
				/>
			</ToolbarGroup>
		</BlockControls>,
		( isEditingURL && (
			<Popover
				position="bottom center"
				onClose={ () => {
					setIsEditingURL( false );
				} }
				anchorRef={ ref?.current }
				focusOnMount={ isEditingURL ? 'firstElement' : false }
			>
				<LinkControl
					className="wp-block-navigation-link__inline-link-input"
					value={ { url: link_url, opensInNewTab } }
					onChange={ ( {
									 url: newURL = '',
									 opensInNewTab: newOpensInNewTab,
								 } ) => {
						setAttributes( { link_url: newURL } );

						if ( opensInNewTab !== newOpensInNewTab ) {
							onToggleOpenInNewTab( newOpensInNewTab );
						}
					} }
					onRemove={ () => {
						unlink();
					} }
				/>
			</Popover>
		) ),
		<InspectorControls key="inspector_controls">
			<Panel>
				<PanelBody title="Card Settings" initialOpen={true}>
					<ToggleControl
						label="Borderless"
						checked={attributes.card_borderless}
						onChange={onChangeBorderless}
					/>
					<ToggleControl
						label="Rounded"
						checked={attributes.card_rounded}
						onChange={onChangeRounded}
					/>
					<NumberControl
						label="Elevation"
						isShiftStepEnabled={true}
						onChange={onChangeElevation}
						shiftStep={1}
						value={attributes.card_elevation}
						help="Controls the amount of shadow"
					/>
					<SelectControl
						label="Card Sizes"
						onChange={onChangeCardSize}
						options={cardSizes}
						value={attributes.card_size}
						help="Controls the amount of padding for the card"
					/>
				</PanelBody>
			</Panel>
			<Panel>
				<PanelBody title="Card Header Settings" initialOpen={true}>
					<SelectControl
						label="Card Header Size"
						onChange={onChangeCardHeaderSize}
						options={cardSizes}
						value={attributes.card_header_size}
						help="Controls the amount of padding in the card header"
					/>
					<NumberControl
						label="Header Level"
						isShiftStepEnabled={true}
						onChange={onChangeHeaderLevel}
						shiftStep={1}
						value={attributes.header_level}
						help="Controls header level (h1, h2, h3)"
					/>
				</PanelBody>
			</Panel>
		</InspectorControls>,
		<div {...blockProps} key="render" className={className}>
			<Card {...useBlockProps()}
				  size={attributes.card_size}
				  isBorderless={attributes.card_borderless}
				  isRounded={attributes.card_rounded}
				  elevation={attributes.card_elevation}
			>
				<CardHeader size={attributes.card_header_size}>
					{ attributes.header_text && ! isSelected ? (
						<Heading level={attributes.header_level}
								 value={attributes.header_text}
						>
							{ attributes.header_text }
						</Heading>
					) : (
						<Placeholder
							label="Card header text"
							instructions="Add your heading"
						>
							<TextControl
								label="Card header text"
								hideLabelFromVision={true}
								type="text"
								value={ attributes.header_text }
								onChange={ onChangeHeaderText }
							/>
						</Placeholder>
					) }
				</CardHeader>
				<CardBody>
					<InnerBlocks allowedBlocks={ALLOWED_BLOCKS}/>
				</CardBody>
				<details>
					<summary>Debug: <code>$attributes</code></summary>
					<pre>
				{JSON.stringify(attributes, null, 2)}
			</pre>
				</details>
			</Card>
		</div>,
	];
}
