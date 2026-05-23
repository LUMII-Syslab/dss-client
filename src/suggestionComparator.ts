
import type { NamespaceData } from "./index.js";

type Prefixes = {
    [prefixLabel: string]: string;
};

/**
 * Tries to convert a full IRI to its short form using available prefixes.
 * @param prefixes The mapping of prefixes to their corresponding IRIs 
 * @param iri 
 * @returns Short form of the IRI if a matching prefix is found, otherwise null
 */
function tryIriToShortForm(prefixes: Prefixes, iri: string) {
    const matchingPrefix = Object.keys(prefixes).find(prefix => iri.startsWith(prefixes[prefix]!));
    if (matchingPrefix !== undefined) {
        return matchingPrefix + ":" + iri.substring(prefixes[matchingPrefix]!.length);
    }
    return null;
}

/**
 * Checks if `sub` is a subsequence of `str`, meaning all characters of `sub` appear in `str` in the same order, but not necessarily contiguously.
 * @param sub The potential subsequence to check
 * @param str The string to check against
 * @returns True if `sub` is a subsequence of `str`, false otherwise
 */
function isSubsequence(sub: string, str: string) {
    let subIndex = 0;
    for (let i = 0; i < str.length && subIndex < sub.length; i++) {
        if (str[i] === sub[subIndex]) {
            subIndex++;
        }
    }
    return subIndex === sub.length;
}

export function suggestionComparator(prefixes: Prefixes, token: string, namespaceData: NamespaceData[]) {
    return (a: { value: string, count: number }, b: { value: string, count: number }) => {
        // prioritize suggestions where token is a subsequence of the suggestion
        const tokenString = (token || "").toLocaleLowerCase();
        const shortFormTokenString = (tryIriToShortForm(prefixes, tokenString) || tokenString).toLocaleLowerCase();
        const aShortForm = (tryIriToShortForm(prefixes, a.value) || a.value).toLocaleLowerCase();
        const bShortForm = (tryIriToShortForm(prefixes, b.value) || b.value).toLocaleLowerCase();
        const aLower = a.value.toLocaleLowerCase();
        const bLower = b.value.toLocaleLowerCase();
        const aIsSubsequence = isSubsequence(shortFormTokenString, aShortForm);
        const bIsSubsequence = isSubsequence(shortFormTokenString, bShortForm);
        if (aIsSubsequence && !bIsSubsequence) return -1;
        if (!aIsSubsequence && bIsSubsequence) return 1;
        // Then prioritize namespaces where basic order sequence is lower (higher relevance)
        const priorityA = namespaceData.find(v => aLower.startsWith(v.value.toLocaleLowerCase()))?.basic_order_level ?? Number.POSITIVE_INFINITY;
        const priorityB = namespaceData.find(v => bLower.startsWith(v.value.toLocaleLowerCase()))?.basic_order_level ?? Number.POSITIVE_INFINITY;
        if (priorityA !== priorityB) {
            return priorityA - priorityB;
        }
        // Then by count as tiebreaker (descending - highest count first)
        return b.count - a.count;
    };
}
