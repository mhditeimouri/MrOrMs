const name = document.getElementById("Name")
const submit = document.getElementById("Submit")
const save = document.getElementById("Save")
const clear = document.getElementById("Clear")
const gender = document.getElementById("Gender")
const accuracy = document.getElementById("Accuracy")
const source = document.getElementById("Source")
const male = document.getElementById("Male")
const female = document.getElementById("Female")
const localStorage = window.localStorage
const loading = document.getElementById("Loading")
const error_div = document.getElementById("ErrorDiv")

name.addEventListener("keydown", empty_fields);

function hide(element) {
    element.style.visibility = "hidden";
}

function show(element) {
    element.style.visibility = "visible";
}

function empty_fields(event) {
    gender.innerHTML = "";
    hide(accuracy);
    hide(clear);
    hide(save);
    accuracy.innerHTML = "";
    source.innerHTML = "";
}

name.addEventListener("keydown", function (event) {
    let key = event.key;
    let regex = /[^a-zA-Z\s]+/;
    if (regex.test(key) && key !== "Backspace" && key !== "Delete" && key !== "ArrowLeft" && key !== "ArrowRight") {
        console.log(key);
        event.preventDefault();
    }
})

function showError(error) {
    show(error_div);
    error_div.innerHTML = error;
}

function get_result() {
    fetch("https://api.genderize.io/?name=" + name.value).then((response) => {
        if (!response.ok) {
            throw new Error("Network response was not ok, " + response.status);
        }
        return response.json();
    }).then(
        (data) => {
            if (data["gender"] === null) {
                throw new Error("This name does not exist");
            }
            hide(loading)
            gender.innerHTML = data["gender"][0].toUpperCase() + data["gender"].slice(1);
            accuracy.innerHTML = data["probability"];
            show(accuracy);
            source.innerHTML = "Fetched result";
            show(save);
        }
    ).catch((error) => {
        hide(loading);
        showError(error);
    })
}

submit.addEventListener("click", function (event) {
    hide(error_div);
    hide(save);
    hide(clear);
    empty_fields();
    show(loading);
    let saved_result = localStorage.getItem(name.value);
    if (saved_result) {
        hide(loading)
        gender.innerHTML = saved_result;
        source.innerHTML = "Saved result";
        show(clear);
    } else {
        get_result();
    }
    event.preventDefault();
});

save.addEventListener("click", function (event) {
    let value;
    if (name.value === "") {
        showError(Error("Name is empty."))
        event.preventDefault();
        return;
    }
    if (male.checked) {
        value = male.value;
    } else if (female.checked) {
        value = female.value;
    } else {
        showError(Error("Selected gender is empty"))
        event.preventDefault();
        return;
    }
    localStorage.setItem(name.value, value);
    hide(accuracy);
    hide(save);
    gender.innerHTML = value
    source.innerHTML = "Saved result";
    show(clear);
    event.preventDefault();
})

clear.addEventListener("click", function (event) {
    localStorage.removeItem(name.value);
    source.innerHTML = "Result removed";
})

error_div.addEventListener("click", function (event) {
    hide(error_div);
    event.stopPropagation();
});