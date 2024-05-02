const core = require('@actions/core');

try {
    let {
        "main-db": mainDb,
        "main-php": mainPhp,
        "main-moodle": mainMoodle,
        "moodle-php": moodlePhp,
        "dbs": dbs,
        "moodle-plugin-ci": moodlePluginCi
    } = JSON.parse(core.getInput('input'));

    mainDb ??= "pgsql";
    dbs ??= ["pgsql", "mariadb", "mysql", "mssql", "oracledb"];

    console.log(mainDb, mainPhp, mainMoodle, moodlePhp, dbs, moodlePluginCi);

    core.setOutput("static_matrix", JSON.stringify({
        include: [{
            "php": mainPhp,
            "moodle-branch": mainMoodle,
            "database": mainDb
        }]
    }));

    const testmatrix = [];

    for (const [moodle, phps] of Object.entries(moodlePhp)) {
        for (const php of phps) {
            testmatrix.push({
                "php": php,
                "moodle-branch": moodle,
                "database": mainDb
            })
        }
    }

    for (const db of dbs) {
        if (db === mainDb)
            continue;
        testmatrix.push({
            "php": mainPhp,
            "moodle-branch": mainMoodle,
            "database": db
        })
    }

    core.setOutput("test_matrix", JSON.stringify({
        include: testmatrix
    }));

} catch (error) {
    core.setFailed(error.message);
}