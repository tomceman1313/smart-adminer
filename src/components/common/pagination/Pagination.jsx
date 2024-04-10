import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import css from "./Pagination.module.css";

/**
 * * Pagination component - adds links which add page numbers to url adress
 * ? Its necessary to also import function sliceDataBasedOnPageNumber from BasicFunction
 * @param {number} dataLength - length of all loaded data from server
 * @param {number} numberOfItemsInPage - how many items are shown in one page
 * @param {string} path - url path for links
 * @returns
 */
export default function Pagination({ dataLength, numberOfItemsInPage, path }) {
	const { page } = useParams();
	const [pages, setPages] = useState([]);

	useEffect(() => {
		if (!dataLength) {
			return;
		}
		let arrayOfNumberPages = [];
		let numberOfPages = dataLength / numberOfItemsInPage;
		if (numberOfPages % 1 > 0) {
			numberOfPages = Math.ceil(numberOfPages);
		}

		while (numberOfPages > 0) {
			const number = numberOfPages;
			let active = number === Number(page) ? true : false;
			if (!page) {
				active = number === 1 ? true : false;
			}
			arrayOfNumberPages.push({ pageNumber: number, isActive: active });
			--numberOfPages;
		}
		arrayOfNumberPages.reverse();
		setPages(arrayOfNumberPages);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [page, dataLength]);

	return (
		<div className={css.pagination}>
			{pages.length > 0 ? (
				pages.map((item) => (
					<Link to={`${path}/${item.pageNumber}`} key={`page-${item.pageNumber}`} className={item.isActive ? css.active : ""}>
						{item.pageNumber}
					</Link>
				))
			) : (
				<></>
			)}
		</div>
	);
}
