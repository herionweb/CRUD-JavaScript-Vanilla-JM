const d = document;

d.addEventListener("DOMContentLoaded", e => {
	ajax();
});

const $title = d.querySelector(".title");
const $form = d.getElementById("form");
const $template = d.getElementById("template").content;
const $fragment = d.createDocumentFragment();
const $tableTBody = d.querySelector("table tbody");

const url = "http://localhost:3000/player";

const ajax = async () => {

	try {

		const res = await fetch(url);
		if (!res.ok) throw { statusText: res.statusText, status: res.status }
		const json = await res.json();

		json.forEach(player => {
			$template.querySelector(".name-player").textContent = player.name;
			$template.querySelector(".dorsal-player").textContent = player.dorsal;
			$template.querySelector(".edit").dataset.id = player.id;
			$template.querySelector(".edit").dataset.name = player.name;
			$template.querySelector(".edit").dataset.dorsal = player.dorsal;
			$template.querySelector(".delete").dataset.id = player.id;

			let $clone = d.importNode($template, true);
			$fragment.appendChild($clone);
		});

		$tableTBody.appendChild($fragment);


	} catch (error) {
		const errorNode = d.createElement("div");
		errorNode.textContent = `Error ${error.status},${error.statusText}`;
		errorNode.classList.add("alert", "alert-danger");
		d.querySelector(".table").insertAdjacentElement("afterend", errorNode)
	}
}

$form.addEventListener("submit", async e => {
	e.preventDefault();

	if (!$form.id.value) {
		// Create POST
		console.log("POST");
		const options = {
			method: "POST",
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				name: e.target.name.value,
				dorsal: e.target.dorsal.value
			})
		}

		const res = await fetch(`${url}`, options);
		let json = await res.json();
		location.reload();

	} else {
		// Update PUT
		const options = {
			method: "PUT",
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				name: e.target.name.value,
				dorsal: e.target.dorsal.value
			})
		}

		console.log(e.target.id.value);
		console.log("PUT");

		await fetch(`${url}/${e.target.id.value}`, options);
		location.reload();

	}

});

d.addEventListener("click", e => {
	if (e.target.matches(".edit")) {
		$title.textContent = "Edit Player";
		$form.name.value = e.target.dataset.name;
		$form.dorsal.value = e.target.dataset.dorsal;
		$form.id.value = e.target.dataset.id;
	}
});

d.addEventListener("click", async e => {
	if (e.target.matches(".delete")) {

		const options = {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json"
			}
		}

		await fetch(`${url}/${e.target.dataset.id}`, options)

	}
});