$(document).ready(function () {
    var signatureContainer = $("#digital-signature-container");
    var signatureBlock = $("#credentials-block");

    var useBlock = signatureBlock && signatureBlock.length !== 0;
    var useContainer = signatureContainer && signatureContainer.length !== 0;

    if (useBlock || useContainer)
    {
        EDS.GetCertificates();
    }
});
