"use strict";

(function (document) {
    // Set up our test viewer.
    if (!document.getElementById("qunit")) {
        var testDisplay = document.createElement("div");
        testDisplay.id = "qunit";

        document.body.insertBefore(testDisplay, window.document.body.firstChild);
    }

    QUnit.module("Parser Tests");

    var testValues = {
        IE9a: "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0; yie8)",
        IE9b: "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.0; Trident/4.0; GTB7.4; InfoPath.3; SV1; .NET CLR 3.1.76908; WOW64; en-US)",
        IE10a: "Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; Trident/4.0; InfoPath.2; SV1; .NET CLR 2.0.50727; WOW64)",
        IE10b: "Mozilla/5.0 (compatible; MSIE 10.6; Windows NT 6.1; Trident/5.0; InfoPath.2; SLCC1; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; .NET CLR 2.0.50727) 3gpp-gba UNTRUSTED/1.0",
        IE11: "Mozilla/5.0 (compatible, MSIE 11, Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko",
        FF36: "Mozilla/5.0 (Windows NT 6.3; rv:36.0) Gecko/20100101 Firefox/36.0",
        FF16: "Mozilla/6.0 (Windows NT 6.2; WOW64; rv:16.0.1) Gecko/20121011 Firefox/16.0.1",
        Chrome41: "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36",
        Chrome14: "Mozilla/5.0 (X11; Linux i686) AppleWebKit/535.1 (KHTML, like Gecko) Ubuntu/11.04 Chromium/14.0.814.0 Chrome/14.0.814.0 Safari/535.1",
        Nonsense: "won't work",
        BadIE: "Mozilla/5.0 (compatible; MSIE-12; Windows NT 6.1; Trident/4.0; InfoPath.2; SV1; .NET CLR 2.0.50727; WOW64)",
        BadChrome: "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome 41.0.2228.0 Safari/537.36",
        BadFirefox: "Mozilla/5.0 (Windows NT 6.3; rv:36.0) Gecko/20100101 Firefox 36.0"
    };

    function scenarioBuilder(uas, name, version) {
        return {
            UserAgentString: uas,
            Name: name,
            Version: version
        };
    }

    var validTests = [
        scenarioBuilder(testValues.IE9a, "Internet Explorer", "9.0"),
        scenarioBuilder(testValues.IE9b, "Internet Explorer", "9.0"),
        scenarioBuilder(testValues.IE10a, "Internet Explorer", "10.0"),
        scenarioBuilder(testValues.IE10b, "Internet Explorer", "10.6"),
        scenarioBuilder(testValues.IE11, "Internet Explorer", "11"),
        scenarioBuilder(testValues.FF36, "Firefox", "36.0"),
        scenarioBuilder(testValues.FF16, "Firefox", "16.0.1"),
        scenarioBuilder(testValues.Chrome41, "Chrome", "41.0.2228.0"),
        scenarioBuilder(testValues.Chrome14, "Chrome", "14.0.814.0")
    ];
        
    var invalidTests = [
        scenarioBuilder(testValues.Nonsense, "Nothing", "FAIL"),
        scenarioBuilder(testValues.BadIE, "Internet Explorer", "FAIL"),
        scenarioBuilder(testValues.BadFirefox, "Firefox", "FAIL"),
        scenarioBuilder(testValues.BadChrome, "Chrome", "FAIL")
    ];
    
    /**
     * Runs a test with the specified name, asserting that the specified scenario's
     * UserAgentString is parsed to an object with a name and version matching the
     * scenario's Name and Version property values.
     */
    function expectValid(name, scenario) {
        QUnit.test(name, function (assert) {
            var browser = AgentCompatible.GetSupportedBrowserInfo(scenario.UserAgentString);

            assert.equal(scenario.Name, browser.Name);
            assert.equal(scenario.Version, browser.Version);
        });
    }

    for (var i = 0; i < validTests.length; i++) {
        var name = validTests[i].Name + " v" + validTests[i].Version + " is valid.";

        expectValid(name, validTests[i]);
    };

    /**
     * Runs a test with the specified name, asserting that the scenario's specified
     * UserAgentString is not successfully parsed.
     */
    function expectInvalid(name, scenario) {
        QUnit.test(name, function (assert) {
            var browser = AgentCompatible.GetSupportedBrowserInfo(scenario.UserAgentString);

            assert.ok(!browser);
        });
    }

    for (var i = 0; i < invalidTests.length; i++) {
        var name = invalidTests[i].Name + " v" + invalidTests[i].Version
            + " is not valid. (That's good!)";

        expectInvalid(name, invalidTests[i]);
    };
}(window.document));