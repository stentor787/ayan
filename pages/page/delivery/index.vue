<template>
  <div v-if="$i18n.locale === 'ru'" class="d-flex-column justify-center pa-10">
    <h1 class="text-center font-weight-black mb-5">
      Доставка
    </h1>
    <p>Наш магазин осуществляет бесплатную доставку товаров по городу Караганда и городу Темиртау из розничных супермаркетов «АЯН». В момент оформления заказа при выборе варианта доставки система также предложит Вам заполнить адрес доставки.</p>
    <h2 class="pt-10">
      Размещение заказа:
    </h2>
    <div class="indentation">
      <p>
        Минимальная сумма заказа — зависит от поставщика.<br>
        Вы можете размещать заказы на сайте круглосуточно и без выходных.<br>
        Доставка работает ежедневно с 11.00 до 22.00. Без выходных дней.<br>
        Заказы, сделанные с 11.00 до 22.00. доставляются в день оформления заказа в любое удобное для Вас время или другую дату, указанную Вами, но не ранее, чем через 1 час после оформления заказа.<br>
        Заказы, сделанные с 22.00 до 00.00 доставляются на следующий день в любое удобное для Вас время или другую дату, указанную Вами.<br>
      </p>
    </div>
    <h2>Стоимость доставки товаров:</h2>
    <div class="indentation">
      <p>
        Стоимость доставки — бесплатно.<br>
        При Заказе акционного товара свыше 20 упаковок к основной стоимости доставки дополнительно оплачивается 1000 тенге.<br>
      </p>
    </div>
    <h2>Способы оплаты:</h2>
    <div class="indentation">
      <p>
        Наличными курьеру.<br>
        Картой курьеру.<br>
        Картой онлайн.
      </p>
    </div>
    <h2>Карты доступные к оплате:</h2>
    <div class="indentation">
      <p>
        Visa<br>
        Master Card<br>
        Google Pay<br>
        Apple Pay<br>
      </p>
    </div>
    <h2 class="pt-10">
      Дополнительная информация:
    </h2>
    <div class="indentation">
      <p>
        Если вес Вашего заказа превышает 25 кг — доставка товара осуществляется до подъезда.
        При отсутствии товара, возможна замена на аналогичный по предварительному согласованию с клиентом.
        В случае если Вас не удовлетворяет качество доставленной продукции, Вы имеете право отказаться от всего заказа или части заказа и оплатить только принятый товар;
        Цены на овощи и фрукты в наших магазинах могут отличаться от заявленных на сайте;
        Изображение товаров может отличаться от оригинала;
        Продажа и доставка алкогольной продукции через интернет магазин не осуществляется.
        Товар, участвующий в акции и реализуемый по специальной цене, в период действия акции отпускается не более 10 штук или 5 килограмм весового товар «в одни руки».
        Социальный товар реализуется не более 10кг в «в одни руки».
        Цены на данные товары действительны только в период сроков проведения акции. При этом дата доставки Вашего заказа должна быть не позднее даты окончания текущей акции. По окончании акции цены на товар могут измениться.
        В связи с большим спросом на товары и их ограниченным количеством, наличие данных товаров в день предполагаемой доставки не гарантировано.
      </p>
    </div>
  </div>

  <div v-else class="d-flex-column justify-center pa-10">
    <h1 class="text-center font-weight-black mb-5">
      Жеткізу
    </h1>
    <p>Біздің дүкен Қарағанды каласы мен Теміртау қаласы бойынша «АЯН» бөлшек сауда супермаркеттерінен тауарларды тегін жеткізуді қамтамасыз етеді. Тапсырыс берген кезде, жеткізу опциясын таңдағанда, жүйе сізге жеткізу мекенжайын енгізуді де ұсынады.</p>
    <h2>Тапсырыс беріңіз:</h2>
    <div class="indentation">
      <p>
        Ең аз тапсырыс сомасы - жеткізушіге байланысты.<br>
        Веб-сайтта тәулігіне 24 сағат, аптасына 7 күн тапсырыс бере аласыз.<br>
        Жеткізу күн сайын сағат 11.00-ден 22.00-ге дейін. Демалыс күндері жоқ.<br>
        Тапсырыс 11.00-22.00 аралығында қабылданады. тапсырыс берген күні сізге ыңғайлы кез келген уақытта немесе сіз белгілеген басқа күні жеткізіледі, бірақ тапсырыс бергеннен кейін 1 сағаттан ерте емес.<br>
        Сағат 22.00-ден 00.00-ге дейін берілген тапсырыстар келесі күні сізге ыңғайлы кез келген уақытта немесе сіз белгілеген басқа күні жеткізіледі.<br>
      </p>
    </div>
    <h2>Тауарды жеткізу құны:</h2>
    <div class="indentation">
      <p>
        Жеткізу ақысы тегін.<br>
        Алып кету тегін.<br>
        20 пакеттен асатын жарнамалық өнімге тапсырыс бергенде негізгі жеткізу құнына қосымша 1000 теңге төленеді.<br>
      </p>
    </div>
    <div class="indentation">
      <p>Тапсырыстарды алу AYAN супермаркетінің дүкендерінен тапсырысты растағаннан кейін және телефон арқылы нақты қабылдау күнін келіскеннен кейін жүзеге асырылады. Тапсырыс беру кезінде қоржыннан өзіңізге ыңғайлы дүкенді таңдауға болады.<br></p>
      <p>
        Алып кету қызметі тегін көрсетіледі.
        Тапсырысты жинаудың ең аз уақыты - 15 минут.
        Өнімдер тапсырыс берілген сәттен бастап 1 күнтізбелік күн ішінде сақталады.
        Тапсырысыңыздың толықтығын интернет-дүкен қызметкерінің қатысуымен тексеруге болады.
        Алып кеткеннен кейін тапсырысты толық немесе ішінара жою мүмкіндігі бар.
      </p>
    </div>
    <h2>Төлем әдістері:</h2>
    <div class="indentation">
      <p>
        Курьерге қолма-қол ақша.<br>
        Курьерге карта.<br>
        Онлайн карта арқылы.
      </p>
    </div>
    <h2>Төлем үшін қол жетімді карталар:</h2>
    <div class="indentation">
      <p>
        Visa<br>
        Master Card<br>
        Google Pay<br>
        Apple Pay<br>
      </p>
    </div>
    <h2>Қосымша ақпарат:</h2>
    <div class="indentation">
      <p>
        Тапсырысыңыздың салмағы 25 кг-нан асса, тауар сіздің есігіңізге дейін жеткізіледі.
        Егер өнім қолжетімсіз болса, оны клиентпен алдын ала келісім бойынша ұқсас өніммен ауыстыруға болады.
        Жеткізілген өнімнің сапасына қанағаттанбасаңыз, сіз бүкіл тапсырыстан немесе тапсырыстың бір бөлігінен бас тартуға және тек қабылданған тауар үшін төлеуге құқылысыз;
        Біздің дүкендердегі көкөністер мен жемістердің бағасы веб-сайтта көрсетілгеннен өзгеше болуы мүмкін;
        Өнім кескіндері түпнұсқадан өзгеше болуы мүмкін;
        Интернет-дүкен арқылы алкогольді ішімдіктерді сату және жеткізу жүзеге асырылмайды.
        Акцияға қатысатын және арнайы бағамен сатылатын тауарлар; акция кезеңінде «бір адамға» 10 данадан немесе 5 келіден аспайтын салмақты тауарлар сатылмайды.
        Әлеуметтік тауарлар бір адамға 10 кг-нан аспайтын мөлшерде сатылады.
        Бұл өнімдердің бағасы акция кезеңінде ғана жарамды. Бұл жағдайда тапсырысыңызды жеткізу күні ағымдағы науқанның аяқталу күнінен кешіктірілмеуі керек. Науқан аяқталғаннан кейін өнім бағасы өзгеруі мүмкін.
        Өнімдерге сұраныстың жоғары болуына және санының шектеулі болуына байланысты бұл өнімдердің күтілетін жеткізілім күні қол жетімділігіне кепілдік берілмейді.
      </p>
    </div>
  </div>
</template>
<script>
export default {
  head () {
    return {
      title: 'Условия доставки | Сервис доставки продуктов и товаров для дома Ayanmarket',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content:
           'Подробная информация обо всех условиях доставки: курьерская доставка - Продукты питания и товары с доставкой на дом Ayanmarket'
        }
      ],
      link: [{ rel: 'canonical', href: `https://ayanmarket.kz${this.$route.path}` }]
    }
  }
}
</script>
<style scoped>
h1{
  font-size: 35px;
  font-weight: 500;
}
h2{
  font-size: 22px;
  font-weight: 700;
}
.indentation{
  margin-left: 10px;
  margin-top: 10px;
}
</style>
