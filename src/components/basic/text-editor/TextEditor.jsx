import { EditorProvider, FloatingMenu, BubbleMenu } from "@tiptap/react";
import Image from "@tiptap/extension-image";
import StarterKit from "@tiptap/starter-kit";
import MenuBar from "./MenuBar";

// define your extension array
const extensions = [
	Image.configure({ allowBase64: true }),
	StarterKit.configure({
		bulletList: {
			keepMarks: true,
			keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
		},
		orderedList: {
			keepMarks: true,
			keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
		},
	}),
];

const content = `
  <h2>
	Hi there,
  </h2>
  <p>
	this is a <em>basic</em> example of <strong>Tiptap</strong>. Sure, there are all kind of basic text styles you’d probably expect from a text editor. But wait until you see the lists:
  </p>
  <img src="https://upload.wikimedia.org/wikipedia/commons/8/87/Flaccid_penis_croppedd.jpg" />
  <ul>
	<li>
	  That’s a bullet list with one …
	</li>
	<li>
	  … or two list items.
	</li>
  </ul>
  <p>
	Isn’t that great? And all of that is editable. But wait, there’s more. Let’s try a code block:
  </p>
  <pre><code class="language-css">body {
	display: none;
  }</code></pre>
  <p>
	I know, I know, this is impressive. It’s only the tip of the iceberg though. Give it a try and click a little bit around. Don’t forget to check the other examples too.
  </p>
  <blockquote>
	Wow, that’s amazing. Good work, boy! 👏
	<br />
	— Mom
  </blockquote>
  `;

export default function TextEditor() {
	return (
		<section>
			<EditorProvider
				extensions={extensions}
				content={content}
				slotBefore={<MenuBar />}
			>
				<FloatingMenu editor={null}>This is the floating menu</FloatingMenu>
				<BubbleMenu editor={null}>This is the bubble menu</BubbleMenu>
			</EditorProvider>
		</section>
	);
}
