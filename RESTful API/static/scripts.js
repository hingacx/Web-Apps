window.onload = () => {
  const auth_url = $("#auth").val();
  const home_url = $("#return").val();

  $("#auth").click(() => {
    window.location.href = auth_url;
  });

  $("#return").click(() => {
    window.location.href = home_url;
  });
};
