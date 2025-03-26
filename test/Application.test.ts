describe('Testing: Pruebas unitarias funciones', () => {
    describe('Testing: Funcion OnCreate', () => {
        it('always be true', () => {
            const a = 1;
            const b = 4;
            const c = 5;
            const respuesta = a + b;
            expect(respuesta).toBe(c);
        });
    });

    describe('Testing: Funcion OnUpdate', () => {
        it('always be true', () => {
            const a = 1;
            const b = 4;
            const c = 5;
            const respuesta = a + b;
            expect(respuesta).toBe(c);
        });
    });
});
