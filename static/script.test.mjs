// Unit test for generating breach results table

import { generateTableHTML } from "./script";

test('generateTableHTML creates table with 2 rows 3 columns', () => {
    const testEmail = "test@example.com";
    const testBreaches = [
        { name: "Leak1", date: "2023-01-03", link: "example.com"},
        { name: "Leak2", date: "2023-03-01", link: "example.com"}
    ];

    const html = generateTableHTML(testEmail, testBreahces);

    expect(html).toContain("2 breach(es) found for test@example.com");
    expect(html).toContain("Leak1");
    expect(html).toContain("Leak2");
    expect(html).toContain("2023-01-03");
    expect(html).toContain("2023-03-01");
    expect(html).toContain("example.com");

});