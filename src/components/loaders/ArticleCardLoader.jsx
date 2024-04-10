import ContentLoader from "react-content-loader";

export default function ArticleCardLoader() {
	return (
		<section className="no-section" style={{ display: "flex", justifyContent: "space-between" }}>
			<div style={{ width: "33%" }}>
				<ContentLoader viewBox="0 0 380 250" speed={2} backgroundColor="#e5e5e5" foregroundColor="#f5f5f5">
					<rect x="0" y="0" rx="5" ry="5" width="100%" height="250" />
				</ContentLoader>

				<ContentLoader viewBox="0 0 380 250" speed={2} backgroundColor="#DADADA" foregroundColor="#f5f5f5" style={{ marginTop: "-140px", zIndex: 2 }}>
					<rect x="5%" y="0" rx="5" ry="5" width="90%" height="100" />
				</ContentLoader>
			</div>
			<div style={{ width: "33%" }}>
				<ContentLoader viewBox="0 0 380 250" speed={2} backgroundColor="#e5e5e5" foregroundColor="#f5f5f5">
					<rect x="0" y="0" rx="5" ry="5" width="100%" height="250" />
				</ContentLoader>

				<ContentLoader viewBox="0 0 380 250" speed={2} backgroundColor="#DADADA" foregroundColor="#f5f5f5" style={{ marginTop: "-140px", zIndex: 2 }}>
					<rect x="5%" y="0" rx="5" ry="5" width="90%" height="100" />
				</ContentLoader>
			</div>
			<div style={{ width: "33%" }}>
				<ContentLoader viewBox="0 0 380 250" speed={2} backgroundColor="#e5e5e5" foregroundColor="#f5f5f5">
					<rect x="0" y="0" rx="5" ry="5" width="100%" height="250" />
				</ContentLoader>

				<ContentLoader viewBox="0 0 380 250" speed={2} backgroundColor="#DADADA" foregroundColor="#f5f5f5" style={{ marginTop: "-140px", zIndex: 2 }}>
					<rect x="5%" y="0" rx="5" ry="5" width="90%" height="100" />
				</ContentLoader>
			</div>
		</section>
	);
}
