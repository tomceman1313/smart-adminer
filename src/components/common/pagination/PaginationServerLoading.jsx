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

export default function PaginationServerLoading({
	path,
	totalPages,
	elementReference,
}) {
	const { page } = useParams();
	const [pages] = useState(createPagesArray(totalPages));

	useEffect(() => {
		if (!page) return;

		elementReference.current.scrollIntoView({
			behavior: "instant",
			block: "center",
			inline: "start",
		});
	}, [page, elementReference]);

	return (
		<div className={css.pagination}>
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
