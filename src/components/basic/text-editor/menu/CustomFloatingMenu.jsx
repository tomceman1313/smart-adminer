import { FloatingMenu, useCurrentEditor } from "@tiptap/react";

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
					<div>
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
							onClick={() => editor.chain().focus().toggleBulletList().run()}
							className={editor.isActive("bulletList") ? "is-active" : ""}
						>
							Bullet list
						</button>
					</div>
				</FloatingMenu>
			)}
		</>
	);
}
