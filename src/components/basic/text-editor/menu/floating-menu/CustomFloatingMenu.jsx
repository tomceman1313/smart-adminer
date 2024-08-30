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

	return (
		<>
			{editor && (
				<FloatingMenu
					editor={editor}
					tippyOptions={{ duration: 100 }}
					shouldShow={checkAloneSlash}
				>
					<ul className={css.floating_menu}>
						<MenuItem
							icon={faList}
							title="Nadpis 1"
							onClick={() =>
								editor.chain().focus().toggleHeading({ level: 1 }).run()
							}
							label="Nadpis 1"
						/>

						<MenuItem
							icon={faList}
							title="Nadpis 2"
							onClick={() =>
								editor.chain().focus().toggleHeading({ level: 2 }).run()
							}
							label="Nadpis 2"
						/>

						<MenuItem
							icon={faList}
							title="Nadpis 3"
							onClick={() =>
								editor.chain().focus().toggleHeading({ level: 3 }).run()
							}
							label="Nadpis 3"
						/>

						<MenuItem
							icon={faList}
							title="Odstavec"
							onClick={() => editor.chain().focus().setParagraph().run()}
							label="Odstavec"
						/>

						<MenuItem
							icon={faList}
							title="Odrážkový Seznam"
							onClick={() => editor.chain().focus().toggleBulletList().run()}
							label="Odrážkový Seznam"
						/>

						<MenuItem
							icon={faListOl}
							title="Číselný seznam"
							onClick={() => editor.chain().focus().toggleOrderedList().run()}
							label="Číselný seznam"
						/>

						<MenuItem
							icon={faCode}
							title="Code block"
							onClick={() => editor.chain().focus().toggleCodeBlock().run()}
							label="Kód"
						/>

						<MenuItem
							icon={faQuoteLeft}
							title="Blockquote"
							onClick={() => editor.chain().focus().toggleBlockquote().run()}
							label="Uvozovky"
						/>

						<MenuItem
							icon={faGripLines}
							title="Horizontal rule"
							onClick={() => editor.chain().focus().setHorizontalRule().run()}
							label="Dělící čára"
						/>

						<AddImageButton label="Obrázek" />
					</ul>
				</FloatingMenu>
			)}
		</>
	);
}
