"use strict";

var AgentCompatible = {}; // Namespace

/**
 * Initializes a new browser info record.
 */
AgentCompatible.BrowserInfo = function (name, version) {
    this.Name = name;
    this.Version = version;
};

/**
 * Initializes a new user agent string parser.
 */
AgentCompatible.UserAgentStringParser = function (browserName, regex, aliasFor) {
    this.BrowserName = browserName;
    this.Regex = regex;
};

/**
 * Parses the specified user agent string, returning a new BrowserInfo
 * object.
 */
AgentCompatible.UserAgentStringParser.prototype.Parse = function (userAgentString) {
    var result = null;

    if (userAgentString) {
        var matches = userAgentString.match(this.Regex);

        if (matches) {
            result = new AgentCompatible.BrowserInfo(this.BrowserName, matches[2]);
        }

        return result;
    }
};

/**
 * Creates a new VersionedBrowser.
 *
 * NOTE: The version number will be converted to an integer; if conversion fails,
 * it is set to NaN.
 */
AgentCompatible.VersionedBrowser = function (id, name, versionNumber, greaterVersions) {
    var version = parseInt(versionNumber);

    this.Id = id;
    this.Name = name;
    this.VersionNumber = version;
    this.GreaterVersions = greaterVersions;
};

AgentCompatible.VersionedBrowser.prototype = {
    /**
     * Gets whether the specified browser info satisfies the instance, based on its
     * name and version number.
     */
    IsSatisfiedBy: function (browserInfo) {
        var result = false;

        if (browserInfo instanceof AgentCompatible.BrowserInfo) {
            var versionNumber = parseInt(browserInfo.Version);

            if (!isNaN(versionNumber)) {
                if (this.Name === browserInfo.Name) {
                    result = this.IsVersionNumberSatisfiedBy(versionNumber);
                }
            }
        }

        return result;
    },
    /**
     * Gets whether the specified version number is either identical to instance's
     * number, or greater than it just when GreaterVersions is flagged.
     */
    IsVersionNumberSatisfiedBy: function (versionNumber) {
        var result = false;

        versionNumber = parseInt(versionNumber);

        if (!isNaN(versionNumber)) {
            if (this.VersionNumber === versionNumber) {
                result = true;
            }
            else if (this.GreaterVersions && versionNumber > this.VersionNumber) {
                result = true;
            }
        }

        return result;
    }
};

/**
 * Parsers for our browser types.
 *
 * Careful here: even if a browser is retrieved by one of these parsers, it 
 * still might not be on our "supported" list.  This is just "step one."
 * 
 * "Step two" will check versions.  See AgentCompatible.BrowserIsCompatible().
 */
AgentCompatible.SupportedBrowserTypeParsers = [
    new AgentCompatible.UserAgentStringParser("Internet Explorer", /(MSIE) ([\w\.]+)[\;\,]/),
    new AgentCompatible.UserAgentStringParser("Firefox", /(Firefox)\/([\w\.]+)/),
    new AgentCompatible.UserAgentStringParser("Chrome", /(Chrome)\/([\w\.]+)/)
];

/**
 * Gets information about the browser from which the specified agent
 * string came, but only if it's browser type (IE, FF, Chrome) is one
 * that we might support.
 */
AgentCompatible.GetSupportedBrowserInfo = function (userAgentString) {
    var parsers = AgentCompatible.SupportedBrowserTypeParsers;

    for (var i = 0; i < parsers.length; i++) {
        var browser = parsers[i].Parse(userAgentString);

        if (browser) return browser;
    }
};

/**
 * List of compatible browsers.
 */
AgentCompatible.CompatibleBrowsers = [];

/**
 * Gets whether a browser with the specified info is compatible,
 * per the AgentCompatible.CompatibleBrowsers list.
 */
AgentCompatible.BrowserIsCompatible = function (browserInfo) {
    var result = false;

    if (browserInfo instanceof AgentCompatible.BrowserInfo) {
        result = AgentCompatible.CompatibleBrowsers.some(function (it) {
            return it.IsSatisfiedBy(browserInfo);
        });
    }

    return result;
};

/**
 * Gets whether the specified agent string is compatible.
 */
AgentCompatible.UserAgentStringIsCompatible = function (userAgentString) {
    var browserInfo = AgentCompatible.GetSupportedBrowserInfo(userAgentString);

    return AgentCompatible.BrowserIsCompatible(browserInfo);
};

// Per spec.
AgentCompatible.CompatibleBrowsers = [
    new AgentCompatible.VersionedBrowser(1, "Internet Explorer", 9, false),
    new AgentCompatible.VersionedBrowser(2, "Internet Explorer", 10, false),
    new AgentCompatible.VersionedBrowser(3, "Chrome", 26, true),
    new AgentCompatible.VersionedBrowser(4, "Firefox", 22, true)
];