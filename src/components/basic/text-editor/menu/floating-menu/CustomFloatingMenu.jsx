import {
	faCode,
	faGripLines,
	faList,
	faListOl,
	faQuoteLeft,
} from "@fortawesome/free-solid-svg-icons";
import { FloatingMenu, useCurrentEditor } from "@tiptap/react";
import AddImageButton from "../../image-extender/AddImageButton";
import MenuItem from "../menu-item/MenuItem";

import css from "./CustomFloatingMenu.module.css";

export function CustomFloatingMenu() {
	const { editor } = useCurrentEditor();

	function checkAloneSlash({ editor }) {
		const { selection } = editor.state;
		const { $from } = selection;

		let node = selection.node ? selection.node : $from.node();
		return node.textContent === "/" ? true : false;
	}

	function handleOnClick(callbackFn) {
		const { state, commands } = editor;
		const { selection } = state;
		const { from } = selection;

		// Get the text before the current cursor position
		const textBefore = state.doc.textBetween(from - 1, from, undefined, "\n");

		if (textBefore === "/") {
			// Delete the "/" character
			commands.deleteRange({
				from: from - 1,
				to: from,
			});
		}

		callbackFn();
	}

	return (
		<>
			{editor && (
				<FloatingMenu
					editor={editor}
					tippyOptions={{ duration: 100, zIndex: 5, offset: [130, 0] }}
					shouldShow={checkAloneSlash}
				>
					<ul className={css.floating_menu}>
						<MenuItem
							icon={faList}
							title="Nadpis 1"
							onClick={() =>
								handleOnClick(() =>
									editor.chain().focus().toggleHeading({ level: 1 }).run()
								)
							}
							label="Nadpis 1"
						>
							<span>H1</span>
						</MenuItem>

						<MenuItem
							icon={faList}
							title="Nadpis 2"
							onClick={() =>
								handleOnClick(() =>
									editor.chain().focus().toggleHeading({ level: 2 }).run()
								)
							}
							label="Nadpis 2"
						>
							<span>H2</span>
						</MenuItem>

						<MenuItem
							icon={faList}
							title="Nadpis 3"
							onClick={() =>
								handleOnClick(() =>
									editor.chain().focus().toggleHeading({ level: 3 }).run()
								)
							}
							label="Nadpis 3"
						>
							<span>H3</span>
						</MenuItem>

						<MenuItem
							icon={faList}
							title="Odstavec"
							onClick={() =>
								handleOnClick(() => editor.chain().focus().setParagraph().run())
							}
							label="Odstavec"
						>
							<span>¶</span>
						</MenuItem>

						<MenuItem
							icon={faList}
							title="Odrážkový Seznam"
							onClick={() =>
								handleOnClick(() =>
									editor.chain().focus().toggleBulletList().run()
								)
							}
							label="Odrážkový Seznam"
						/>

						<MenuItem
							icon={faListOl}
							title="Číselný seznam"
							onClick={() =>
								handleOnClick(() =>
									editor.chain().focus().toggleOrderedList().run()
								)
							}
							label="Číselný seznam"
						/>

						<MenuItem
							icon={faCode}
							title="Code block"
							onClick={() =>
								handleOnClick(() =>
									editor.chain().focus().toggleCodeBlock().run()
								)
							}
							label="Kód"
						/>

						<MenuItem
							icon={faQuoteLeft}
							title="Blockquote"
							onClick={() =>
								handleOnClick(() =>
									editor.chain().focus().toggleBlockquote().run()
								)
							}
							label="Uvozovky"
						/>

						<MenuItem
							icon={faGripLines}
							title="Horizontal rule"
							onClick={() =>
								handleOnClick(() =>
									editor.chain().focus().setHorizontalRule().run()
								)
							}
							label="Dělící čára"
						/>

						<AddImageButton label="Obrázek" />
					</ul>
				</FloatingMenu>
			)}
		</>
	);
}
