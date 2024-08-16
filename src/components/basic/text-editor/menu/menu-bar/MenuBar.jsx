import { useCurrentEditor } from "@tiptap/react";
import AddImageButton from "../../image-extender/AddImageButton";
import MenuBarButton from "./MenuBarButton";
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

export default function MenuBar() {
	const { editor } = useCurrentEditor();

	if (!editor) {
		return null;
	}

	return (
		<div className="control-group">
			<div className="button-group">
				<AddImageButton />
				<MenuBarButton
					icon={faBold}
					label="Bold"
					onClick={() => editor.chain().focus().toggleBold().run()}
					disabled={!editor.can().chain().focus().toggleBold().run()}
					className={editor.isActive("bold") ? "is-active" : ""}
				/>
				<MenuBarButton
					icon={faItalic}
					label="Italic"
					onClick={() => editor.chain().focus().toggleItalic().run()}
					disabled={!editor.can().chain().focus().toggleItalic().run()}
					className={editor.isActive("italic") ? "is-active" : ""}
				/>
				<MenuBarButton
					icon={faStrikethrough}
					label="Strike"
					onClick={() => editor.chain().focus().toggleStrike().run()}
					disabled={!editor.can().chain().focus().toggleStrike().run()}
					className={editor.isActive("strike") ? "is-active" : ""}
				/>

				<MenuBarButton
					icon={faCode}
					label="Code"
					onClick={() => editor.chain().focus().toggleCode().run()}
					disabled={!editor.can().chain().focus().toggleCode().run()}
					className={editor.isActive("code") ? "is-active" : ""}
				/>

				<MenuBarButton
					icon={faTextSlash}
					label="Clear formatting"
					onClick={() => editor.chain().focus().unsetAllMarks().run()}
				/>

				<MenuBarButton
					icon={faXmarkSquare}
					label="Clear nodes"
					onClick={() => editor.chain().focus().clearNodes().run()}
				/>

				<button
					onClick={() => editor.chain().focus().setParagraph().run()}
					className={editor.isActive("paragraph") ? "is-active" : ""}
				>
					Paragraph
				</button>
				<button
					onClick={() =>
						editor.chain().focus().toggleHeading({ level: 1 }).run()
					}
					className={
						editor.isActive("heading", { level: 1 }) ? "is-active" : ""
					}
				>
					H1
				</button>
				<button
					onClick={() =>
						editor.chain().focus().toggleHeading({ level: 2 }).run()
					}
					className={
						editor.isActive("heading", { level: 2 }) ? "is-active" : ""
					}
				>
					H2
				</button>
				<button
					onClick={() =>
						editor.chain().focus().toggleHeading({ level: 3 }).run()
					}
					className={
						editor.isActive("heading", { level: 3 }) ? "is-active" : ""
					}
				>
					H3
				</button>
				<button
					onClick={() =>
						editor.chain().focus().toggleHeading({ level: 4 }).run()
					}
					className={
						editor.isActive("heading", { level: 4 }) ? "is-active" : ""
					}
				>
					H4
				</button>
				<button
					onClick={() =>
						editor.chain().focus().toggleHeading({ level: 5 }).run()
					}
					className={
						editor.isActive("heading", { level: 5 }) ? "is-active" : ""
					}
				>
					H5
				</button>
				<button
					onClick={() =>
						editor.chain().focus().toggleHeading({ level: 6 }).run()
					}
					className={
						editor.isActive("heading", { level: 6 }) ? "is-active" : ""
					}
				>
					H6
				</button>
				<MenuBarButton
					icon={faList}
					label="Bullet list"
					onClick={() => editor.chain().focus().toggleBulletList().run()}
					className={editor.isActive("bulletList") ? "is-active" : ""}
				/>

				<MenuBarButton
					icon={faListOl}
					label="Ordered list"
					onClick={() => editor.chain().focus().toggleOrderedList().run()}
					className={editor.isActive("orderedList") ? "is-active" : ""}
				/>

				<MenuBarButton
					icon={faListOl}
					label="Ordered list"
					onClick={() => editor.chain().focus().toggleOrderedList().run()}
					className={editor.isActive("orderedList") ? "is-active" : ""}
				/>

				<MenuBarButton
					icon={faCode}
					label="Code block"
					onClick={() => editor.chain().focus().toggleCodeBlock().run()}
					className={editor.isActive("codeBlock") ? "is-active" : ""}
				/>

				<MenuBarButton
					icon={faQuoteLeft}
					label="Blockquote"
					onClick={() => editor.chain().focus().toggleBlockquote().run()}
					className={editor.isActive("blockquote") ? "is-active" : ""}
				/>

				<MenuBarButton
					icon={faGripLines}
					label="Horizontal rule"
					onClick={() => editor.chain().focus().setHorizontalRule().run()}
				/>

				<MenuBarButton
					icon={faArrowTurnDown}
					style={{ transform: "rotate(90deg)" }}
					label="Hard break"
					onClick={() => editor.chain().focus().setHardBreak().run()}
				/>
				<MenuBarButton
					icon={faArrowRotateLeft}
					label="Undo"
					onClick={() => editor.chain().focus().undo().run()}
					disabled={!editor.can().chain().focus().undo().run()}
				/>

				<MenuBarButton
					icon={faArrowRotateRight}
					label="Redo"
					onClick={() => editor.chain().focus().redo().run()}
					disabled={!editor.can().chain().focus().redo().run()}
				/>
			</div>
		</div>
	);
}
