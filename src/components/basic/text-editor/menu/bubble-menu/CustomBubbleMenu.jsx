import React from "react";
import { BubbleMenu, useCurrentEditor } from "@tiptap/react";
import { TextSelection } from "@tiptap/pm/state";
import MenuItem from "../menu-item/MenuItem";
import {
	faArrowRotateLeft,
	faArrowRotateRight,
	faArrowTurnDown,
	faBold,
	faCode,
	faGripLines,
	faItalic,
	faList,
	faListOl,
	faQuoteLeft,
	faStrikethrough,
	faTextSlash,
	faXmarkSquare,
} from "@fortawesome/free-solid-svg-icons";
import AddImageButton from "../../image-extender/AddImageButton";
import css from "./CustomBubbleMenu.module.css";

export default function CustomBubbleMenu() {
	const { editor } = useCurrentEditor();
	return (
		<>
			{editor && (
				<ul className={css.bubble_menu}>
					<AddImageButton />

					<MenuItem
						icon={faBold}
						title="Bold"
						onClick={() => editor.chain().focus().toggleBold().run()}
						disabled={!editor.can().chain().focus().toggleBold().run()}
						className={editor.isActive("bold") ? "is-active" : ""}
					/>
					<MenuItem
						icon={faItalic}
						title="Italic"
						onClick={() => editor.chain().focus().toggleItalic().run()}
						disabled={!editor.can().chain().focus().toggleItalic().run()}
						className={editor.isActive("italic") ? "is-active" : ""}
					/>
					<MenuItem
						icon={faStrikethrough}
						title="Strike"
						onClick={() => editor.chain().focus().toggleStrike().run()}
						disabled={!editor.can().chain().focus().toggleStrike().run()}
						className={editor.isActive("strike") ? "is-active" : ""}
					/>

					<MenuItem
						icon={faCode}
						title="Code"
						onClick={() => editor.chain().focus().toggleCode().run()}
						disabled={!editor.can().chain().focus().toggleCode().run()}
						className={editor.isActive("code") ? "is-active" : ""}
					/>

					<MenuItem
						icon={faTextSlash}
						title="Clear formatting"
						onClick={() => editor.chain().focus().unsetAllMarks().run()}
					/>

					<MenuItem
						icon={faXmarkSquare}
						title="Clear nodes"
						onClick={() => editor.chain().focus().clearNodes().run()}
					/>

					<MenuItem
						icon={faList}
						title="Bullet list"
						onClick={() => editor.chain().focus().toggleBulletList().run()}
						className={editor.isActive("bulletList") ? "is-active" : ""}
					/>

					<MenuItem
						icon={faListOl}
						title="Ordered list"
						onClick={() => editor.chain().focus().toggleOrderedList().run()}
						className={editor.isActive("orderedList") ? "is-active" : ""}
					/>

					<MenuItem
						icon={faListOl}
						title="Ordered list"
						onClick={() => editor.chain().focus().toggleOrderedList().run()}
						className={editor.isActive("orderedList") ? "is-active" : ""}
					/>

					<MenuItem
						icon={faCode}
						title="Code block"
						onClick={() => editor.chain().focus().toggleCodeBlock().run()}
						className={editor.isActive("codeBlock") ? "is-active" : ""}
					/>

					<MenuItem
						icon={faQuoteLeft}
						title="Blockquote"
						onClick={() => editor.chain().focus().toggleBlockquote().run()}
						className={editor.isActive("blockquote") ? "is-active" : ""}
					/>

					<MenuItem
						icon={faGripLines}
						title="Horizontal rule"
						onClick={() => editor.chain().focus().setHorizontalRule().run()}
					/>

					<MenuItem
						icon={faArrowTurnDown}
						style={{ transform: "rotate(90deg)" }}
						title="Hard break"
						onClick={() => editor.chain().focus().setHardBreak().run()}
					/>
					<MenuItem
						icon={faArrowRotateLeft}
						title="Undo"
						onClick={() => editor.chain().focus().undo().run()}
						disabled={!editor.can().chain().focus().undo().run()}
					/>

					<MenuItem
						icon={faArrowRotateRight}
						title="Redo"
						onClick={() => editor.chain().focus().redo().run()}
						disabled={!editor.can().chain().focus().redo().run()}
					/>
				</ul>
			)}
		</>
	);
}
