import { useEffect } from "react";

const Articles = () => {
	useEffect(() => {
		document.getElementById("banner-title").innerHTML = "Články";
		document.getElementById("banner-desc").innerHTML = "Tvořte a spravujte vlastní články";
	}, []);

	return (
		<div>
			<section>
				<h2>Články</h2>
			</section>
		</div>
	);
};

export default Articles;
