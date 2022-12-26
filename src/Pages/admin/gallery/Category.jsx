import { useCallback } from "react";
import { useEffect, useState } from "react";
import useGalleryApi from "../../Hooks/useGalleryApi";

import { getAll } from "../../modules/ApiFunctions";

const Category = ({ auth }) => {
	//const getAll = useGalleryApi("getall");
	const create = useGalleryApi("create");
	const edit = useGalleryApi("edit");
	const remove = useGalleryApi("remove");

	const get = useCallback(() => {
		getAll("category", setCategories, auth);
	}, [auth]);

	const [categories, setCategories] = useState(null);

	useEffect(() => {
		get();
	}, [get]);

	return (
		<section>
			<h2>Kategorie</h2>
			{/* <ul>
				{categories.map((el) => (
					<li>
						<label>{el.name}</label>
					</li>
				))}
			</ul> */}
		</section>
	);
};

export default Category;
