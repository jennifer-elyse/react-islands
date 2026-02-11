import React, { useMemo, useState } from "react";

const Filters = ({ initialQuery = "" }) => {
	const [query, setQuery] = useState(initialQuery);
	const cleaned = useMemo(() => query.trim(), [query]);

	return (
		<section>
			<label htmlFor="q"><strong>Search</strong></label>
			<div>
				<input
					id="q"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					placeholder="Type to filter"
				/>
			</div>
			<div style={{ marginTop: 8 }}>
				<em>Client state:</em> {cleaned ? `"${cleaned}"` : "(empty)"}
			</div>
		</section>
	);
};

export default Filters;
