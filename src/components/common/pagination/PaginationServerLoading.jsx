import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import css from "./Pagination.module.css";

function createPagesArray(length) {
	let pages = [];
	for (let i = 1; i <= length; i++) {
		pages.push(i);
	}
	return pages;
}

export default function PaginationServerLoading({ path, totalPages }) {
	const { page } = useParams();
	const [pages] = useState(createPagesArray(totalPages));

	useEffect(() => {
		if (!page) return;

		window.scroll(0, localStorage.getItem("scrollHeight"));
	}, [page]);

	function saveScrollHeight() {
		localStorage.setItem("scrollHeight", window.scrollY);
	}

	return (
		<div className={css.pagination} onClick={saveScrollHeight}>
			{pages.length > 0 ? (
				pages.map((item) => (
					<Link
						to={`${path}/${item}`}
						key={`page-${item}`}
						className={
							(!page && item === 1) || Number(page) === item ? css.active : ""
						}
					>
						{item}
					</Link>
				))
			) : (
				<></>
			)}
		</div>
	);
}
