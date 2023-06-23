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
	let numberOfPages = dataLength / numberOfItemsInPage;
	if (numberOfPages % 1 > 0) {
		numberOfPages = parseInt(++numberOfPages);
	}
	let arrayOfNumberPages = [];

	while (numberOfPages > 0) {
		const number = parseInt(numberOfPages);
		let active = number === parseInt(page) ? true : false;
		if (!page) {
			active = number === 1 ? true : false;
		}
		arrayOfNumberPages.push({ pageNumber: number, isActive: active });
		--numberOfPages;
	}

	arrayOfNumberPages.reverse();

	return (
		<div className={css.pagination}>
			{arrayOfNumberPages.map((item) => (
				<Link to={`${path}/${item.pageNumber}`} key={`page-${item.pageNumber}`} className={item.isActive ? css.active : ""}>
					{item.pageNumber}
				</Link>
			))}
		</div>
	);
}
